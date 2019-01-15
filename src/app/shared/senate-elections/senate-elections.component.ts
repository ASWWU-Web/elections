import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../../shared-ng/services/request.service';
import { CURRENT_YEAR, MEDIA_SM } from '../../../shared-ng/config';
import { forkJoin } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
//import { disconnect } from 'cluster';

@Component({
  selector: 'senate-elections',
  templateUrl: './senate-elections.component.html',
  styleUrls: ['./senate-elections.component.css']
})
export class SenateElectionsComponent implements OnInit {

  // TODO:
  //    on initialization get list of candidates (alternatively wait until "Go" and have server only return candidates for one district)
  //    Show the first page with district
  //    bind variable to district choice
  //    Go button that sets show candidates to true
  //    Set districts html to show only when show-candidates is false
  //    Set candidates html to show only when show-candidates is true and candidate list exists
  //    on "Go" build district-candidate list based on selected district
  //      fetch display names and images for district candidate list if we decide not to included
  //        them in original candidate list
  //    use ngfor on district-candidate list
  //    use ngstyle to set unselected pictures to faded state when number of selected pictures + input boxes fillled >= 2
  //    set empty write-in inputs to inactive (grayed out) state when number of selected pictures + input boxes fillled >=2
  //
  //    add a clear button to candidate selection page
  //

  constructor(private rs: RequestService) { }


  stringify(object: any) {
    return JSON.stringify(object, null, 2);
  }

  // Page 0 is districts page
  pageNumber: number = 0;

  //candidatesJSON = {};
  // candidatesJSON = [
  //     {
  //       "id": "0c3fa8c5-d580-4c47-8598-a4bfd7657711",
  //       "election": "e7c5c84f-0a58-4f3b-8490-14ee0737d96f",
  //       "position": "7c336bd7-7e21-4a81-a4c2-bc076852611c",
  //       "username": "sheldon.woodward",
  //       "display_name": "Sheldon Woodward",
  //       "photo": "https://aswwu.com/media/img-md/profiles/1819/02523-2029909.jpg"
  //     },
  //     {
  //       "id": "0c3fa8c5-d580-4c47-8598-a4bfd7657711",
  //       "election": "e7c5c84f-0a58-4f3b-8490-14ee0737d96f",
  //       "position": "7c336bd7-7e21-4a81-a4c2-bc076852611c",
  //       "username": "sheldon.woodward",
  //       "display_name": "Sheldon Woodward",
  //       "photo": "https://aswwu.com/media/img-md/profiles/1819/02523-2029909.jpg"
  //     },
  //     {
  //       "id": "0c3fa8c5-d580-4c47-8598-a4bfd7657711",
  //       "election": "e7c5c84f-0a58-4f3b-8490-14ee0737d96f",
  //       "position": "7c336bd7-7e21-4a81-a4c2-bc076852611c",
  //       "username": "sheldon.woodward",
  //       "display_name": "Sheldon Woodward",
  //       "photo": "https://aswwu.com/media/img-md/profiles/1819/02523-2029909.jpg"
  //     },
  //   ];

  // current election object
  // {
  //   "id": "e7c5c84f-0a58-4f3b-8490-14ee0737d96f",
  //   "election_type": "aswwu",
  //   "start": "2018-11-05 08:00:00.000000",
  //   "end": "2018-11-05 20:00:00.000000"
  // }
  election: any = null;
  // Dictionary where the key is the position id and the value is a singular position object as returned from the server
  positions: any = null;
  // Array of vote objects
  votes: any[] = null;

  // districtModel is the selected district
  districtModel: string = null;
  // candidates is an array of the candidates running for the position
  // [
  //   {
  //     "id": "0c3fa8c5-d580-4c47-8598-a4bfd7657711",
  //     "election": "e7c5c84f-0a58-4f3b-8490-14ee0737d96f",
  //     "position": "7c336bd7-7e21-4a81-a4c2-bc076852611c",
  //     "username": "sheldon.woodward",
  //     "display_name": "Sheldon Woodward",
  //     "photo": "https://aswwu.com/media/img-md/profiles/1819/02523-2029909.jpg"
  //   }
  // ]
  candidates: any[] = [];
  // candidateModel is a dictionary with the username of the candidate as the key, and a boolean indicating whether that candidate is selected as the value
  candidateModel: any = null;
  // Handles write-in votes
  writeInModel = {
    writeIn1: "",
    writeIn2: ""
  };

  pageReady = false;
  submissionSuccess = null;

  ngOnInit() {
    // hide pages
    this.pageNumber=null;
    //reset models
    this.districtModel = null;
    this.candidateModel = null;
    this.writeInModel.writeIn1 = "";
    this.writeInModel.writeIn2 = "";
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
      // console.log("Election", election);
      // console.log("Position", positions);
      // console.log("Votes", votes);

      // Election
      if (election.election_type == "senate") {
        this.election = election;
      }

      // Positions
      this.positions = {};
      for (let position of positions.positions) {
        this.positions[position['id']] = position;
      }

      // Votes
      this.votes = votes['votes'];
      if (this.votes[0]) {
        this.districtModel = this.votes[0]['position'];
      //   console.log("Election ID:", election['id']);
      //   this.getCandidates(election['id'], this.votes[0]['position']);
      }

      this.pageReady = true;
    });
  }

  buildCandidateModel() {
    this.candidateModel = {};
    for (let candidate of this.candidates) {
      this.candidateModel[candidate.username] = false;
    }
  }

  // ---- commenting out this block since we expect the server to return photos
  // addCandidatePhoto(username, i){
  //   let uri = '/profile/' + CURRENT_YEAR + '/' + username;
  //   this.rs.get(uri).subscribe((data) => {
  //     let photoURI = MEDIA_SM + '/'
  //     if (data.photo != "None") {
  //       photoURI =  photoURI + data.photo;
  //     }
  //     else {
  //       photoURI = photoURI + 'images/default_mask/default.jpg';
  //     }
  //     this.candidates[i].photo = photoURI;
  //   }, (data) => {})
  // }
  // ----

  getCandidates() {//(election: string, position: string) {
    if (this.districtModel) {
      // this.rs.get('elections/election/' + election + '/candidate', {"position": position}).subscribe((data) => {
      this.rs.get('elections/election/' + this.election.id + '/candidate', {position: this.districtModel}).subscribe((data) => {
        this.candidates = data.candidates;
        // ---- Commenting out this section becuase we expect to get photo urls from the server ----
        // let i = 0;
        // for (let candidate of this.candidates) {
        //   this.addCandidatePhoto(candidate.username, i);
        //   i = i + 1;
        // }
        // ----
        this.buildCandidateModel();
        if (this.votes.length > 0) {
          for (let vote of this.votes) {
            if (this.candidateModel.hasOwnProperty(vote['vote'])) {
              this.candidateModel[vote['vote']] = true;
            } else {
              if (this.writeInModel.writeIn1 == "") {
                this.writeInModel.writeIn1 = vote['vote'] || "";
              } else {
                this.writeInModel.writeIn2 = vote['vote'] || "";
              }
            }
          }
        }
      }, (data) => {console.log("error", data)});
      // Page 1 is the candidates page
      this.pageNumber = 1;
      window.scrollTo(0,0);
    }
  }

  getVotes() {
    this.rs.get('elections/vote').subscribe((data) => {
      this.votes = data['votes'];
      if (this.votes[0]) {
        this.districtModel = this.votes[0]['position'];
      }
    }, (error)=>{});
  }

  submit() {
    // let postURI = 'elections/vote';
    // let response = this.buildJsonResponse(this.election.id, this.positions[this.districtModel].id);
    // this.rs.post(postURI, response[0]).subscribe(
    //   (data)=>{
    //     console.log("First post", data);
    //     this.rs.post(postURI, response[1]).subscribe(
    //       (data)=>{
    //         console.log("Second post", data);
    //         this.submissionSuccess = true;
    //       },
    //       (data)=>{
    //         console.log("Second post fail", data);
    //         this.submissionSuccess = false
    //       });
    //   },
    //   (data)=>{
    //     console.log("First post fail", data);
    //     this.submissionSuccess = false
    //   });

    let voteList: string[] = [];

    for (let candidate in this.candidateModel) {
      if (this.candidateModel[candidate] == true) {
        voteList.push(candidate);
      }
    }
    for (let candidate in this.writeInModel) {
      if (this.writeInModel[candidate].length > 0) {
        voteList.push(this.writeInModel[candidate]);
      }
    }
    if (voteList.length > 2) {
      voteList = voteList.slice(0,2);
    }

    let updateVotes = this.votes.filter(vote => !voteList.includes(vote.vote));
    let newVotes = voteList.filter(vote => !this.votesInclude(vote));
    let requestArray = [];
    console.log("updateVotes: ", updateVotes, "newVotes: ", newVotes);

    for (let vote of updateVotes) {
      vote.vote = newVotes.pop;
      requestArray.push(this.rs.put('elections/vote'+vote.id, vote));
    }

    for (let vote of newVotes) {
      let newVote = {
        election: this.election.id,
        position: this.districtModel,
        vote: vote
      }
      requestArray.push(this.rs.post('elections/vote', newVote));
    }

    forkJoin(requestArray).subscribe((data)=>{console.log(data)}, (err)=>{console.log(err)});



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
    if (this.writeInModel.writeIn1.length > 0) {
      numSelected = numSelected + 1;
    }
    if (this.writeInModel.writeIn2.length > 0) {
      numSelected = numSelected + 1;
    }
    if (numSelected >= 2) {
      if (isCandidate) {
        return this.candidateModel[name];
      } else {
        return (name.length > 0);
      }
    } else {
      return true;
    }
  }

  votesInclude(username: string) {
    for (let vote in this.votes) {
      if (vote['vote'] == username) {
        return true;
      }
    }
    return false;
  }
}
