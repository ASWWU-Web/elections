import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../../shared-ng/services/request.service';
import { forkJoin, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, pluck, switchMap, tap } from 'rxjs/operators';
import { MEDIA_SM, CURRENT_YEAR } from 'src/shared-ng/config';

@Component({
  selector: 'senate-elections',
  templateUrl: './senate-elections.component.html',
  styleUrls: ['./senate-elections.component.css']
})
export class SenateElectionsComponent implements OnInit {

  constructor(private rs: RequestService) { }

  // Page 0 is districts page
  pageNumber: number = 0;

  // current election object
  election: {id: string, election_type: string, start: string, end: string} = null;
  // Dictionary where the key is the position id and the value is a singular position object as returned from the server
  positions: any = null;
  // List of tuples containing the id and position name
  positionsList: any = [];
  // Array of vote objects
  votes: {id: string, election: string, position: string, vote: string, username: string}[] = null;

  // districtModel is the selected district
  districtModel: string = null;
  // candidates is an array of the candidates running for the position
  candidates: {id: string, election: string, position: string, username: string, display_name:string, photo: string}[] = [];
  // candidateModel is a dictionary with the username of the candidate as the key, and a boolean indicating whether that candidate is selected as the value
  candidateModel: any = null;
  // Handles write-in votes
  writeInModel = {
    writeIn1: null,
    writeIn2: null
  };

  pageReady: boolean = false;
  submissionSuccess: boolean = null;

  ngOnInit() {

    // hide pages
    this.pageNumber=null;
    //reset models
    this.districtModel = null;
    this.candidateModel = {};
    this.writeInModel.writeIn1 = null
    this.writeInModel.writeIn2 = null
    this.submissionSuccess = null;
    // go to first page (district selection)
    this.pageNumber = 0;
    window.scrollTo(0,0);

    let electionObservable = this.rs.get('elections/current');
    let positionsObservable = this.rs.get('elections/position', {election_type: "senate", active: true});
    let voteObservable = this.rs.get('elections/vote');

    let initObservable = forkJoin([electionObservable, positionsObservable, voteObservable]);

    initObservable.subscribe(data => {
      let election = data[0];
      let positions = data[1];
      let votes = data[2];

      // Election
      if (election.election_type == "senate") {
        this.election = election;
      }

      // Positions
      this.positions = {};
      this.positionsList = [];
      for (let position of positions.positions) {
        this.positions[position['id']] = position;
        this.positionsList.push([position.id, position.position])
      }

      // Votes
      this.votes = votes['votes'];
      if (this.votes[0]) {
        this.districtModel = this.votes[0]['position'];
      }

      this.pageReady = true;
    });
  }


  getNames(query: string) {
    if (query == '') {
      return of({results: []});
    }
    return this.rs.get("search/names", {'full_name': query});
  }


  search = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((data)=>{return this.getNames(data)}),
      map((data: {results: {username: string, full_name: string}[]})=>{
        return data.results.map((item)=>item.username);
      })
    )
  }


  buildCandidateModel() {
    this.candidateModel = {};
    for (let candidate of this.candidates) {
      this.candidateModel[candidate.username] = false;
    }
  }


  addCandidatePhoto(username, i){
    let uri = '/profile/' + CURRENT_YEAR + '/' + username;
    this.rs.get(uri).subscribe((data) => {
      let photoURI = MEDIA_SM + '/'
      if (data.photo != "None") {
        photoURI =  photoURI + data.photo;
      }
      else {
        photoURI = photoURI + 'images/default_mask/default.jpg';
      }
      this.candidates[i].photo = photoURI;
    }, (data) => {})
  }


  getCandidates() {//(election: string, position: string) {
    if (this.districtModel) {
      // this.rs.get('elections/election/' + election + '/candidate', {"position": position}).subscribe((data) => {
      this.rs.get('elections/election/' + this.election.id + '/candidate', {position: this.districtModel}).subscribe((data) => {
        this.candidates = data.candidates;
        let i = 0;
        for (let candidate of this.candidates) {
          this.addCandidatePhoto(candidate.username, i);
          i = i + 1;
        }
        this.buildCandidateModel();
        if (this.votes.length > 0) {
          for (let vote of this.votes) {
            if (this.candidateModel.hasOwnProperty(vote['vote'])) {
              this.candidateModel[vote['vote']] = true;
            } else if (vote['position'] == this.districtModel) {
              if (!this.writeInModel.writeIn1) {
                this.writeInModel.writeIn1 = vote['vote'] || null;
              } else {
                this.writeInModel.writeIn2 = vote['vote'] || null;
              }
            }
          }
        }
      }, (data) => {
        // console.log("error", data);
      });
      // Page 1 is the candidates page
      this.pageNumber = 1;
      window.scrollTo(0,0);
    }
  }


  submit() {
    let voteList: string[] = [];

    for (let candidate in this.candidateModel) {
      if (this.candidateModel[candidate] == true) {
        voteList.push(candidate);
      }
    }
    for (let candidate in this.writeInModel) {
      if (this.writeInModel[candidate]) {
        voteList.push(this.writeInModel[candidate]);
      }
    }
    if (voteList.length > 2) {
      voteList = voteList.slice(0,2);
    }

    // votes from the server that can be updated (overwritten) using their id
    let updateVotes = this.votes
    let newVotes = voteList
    // update all votes if not voting in the same district
    if(this.votes.length > 0 && this.districtModel == this.votes[0].position) {
      updateVotes.filter(vote => !voteList.includes(vote['vote']));
      newVotes.filter(vote => !this.votesInclude(vote));
    }
    // votes on the client that don't exist already on the server
    let requestArray = [];

    for (let vote of updateVotes) {
      let newVote = Object.assign({}, vote);
      newVote['vote'] = newVotes.pop();
      newVote['position'] = this.districtModel
      if (newVote.vote) {
        requestArray.push(this.rs.put('elections/vote/'+newVote.id, newVote));
      }
    }

    for (let vote of newVotes) {
      let newVote = {
        election: this.election.id,
        position: this.districtModel,
        vote: vote
      }
      requestArray.push(this.rs.post('elections/vote', newVote));
    }

    forkJoin(requestArray).subscribe((data)=>{
      this.submissionSuccess = true;
    }, (err)=>{
      this.submissionSuccess = false;
    }, ()=>{
      this.submissionSuccess = true;
      // TODO: Note: this callback runs when the subscription is complete
      // and error free, so if the user doesn't submit any new votes this callback is
      // needed in order to make sure we show the success message.
    });

    // Page 2 is the submission page
    this.pageNumber = 2;
    window.scrollTo(0,0);
  }


  valueChange($event, username){
    this.candidateModel[username] = $event;
  }


  enableVoting(name, isCandidate) {
    let numSelected = 0;
    for (let candidate in this.candidateModel) {
      if (this.candidateModel[candidate] == true) {
        numSelected = numSelected + 1;
      }
    }
    if (this.writeInModel.writeIn1) {
      numSelected = numSelected + 1;
    }
    if (this.writeInModel.writeIn2) {
      numSelected = numSelected + 1;
    }
    if (numSelected >= 2) {
      if (isCandidate) {
        return this.candidateModel[name];
      } else {
        return (Boolean(name));
      }
    } else {
      return true;
    }
  }


  votesInclude(username: string) {
    for (let vote of this.votes) {
      if (vote['vote'] == username) {
        return true;
      }
    }
    return false;
  }
}
