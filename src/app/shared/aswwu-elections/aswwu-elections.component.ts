import { Component, OnInit } from '@angular/core';
import { RequestService } from "../../../shared-ng/services/services"
import {Router,ActivatedRoute } from '@angular/router'
import { CURRENT_YEAR, MEDIA_SM } from '../../../shared-ng/config';
import { debounceTime, distinctUntilChanged, map, pluck, switchMap, tap } from 'rxjs/operators';
import {Observable, of } from 'rxjs';

@Component({
  selector: 'aswwu-elections',
  templateUrl: './aswwu-elections.component.html',
  styleUrls: ['./aswwu-elections.component.css']
})
export class AswwuElectionsComponent implements OnInit {
  allUsers: any[] = [];
  election: any;
  votes: any;
  hasVoted: boolean = false; 
  positions: any[] = [];
  pageNumber: number = 0;

  candidates: any[] = [];
  candidateModel: any = {};
  writeInModel = {
    writeIn1: null 
  };

  submissionSuccess = true;

  constructor(private requestService: RequestService, private route: ActivatedRoute, private router:Router) {
    // get current election
    this.requestService.get('/elections/current').subscribe((data) => {
      this.election = data;
      // get all aswwu positions
      this.requestService.get('/elections/position', {election_type: "aswwu", active: true}).subscribe((data) => {
        this.positions = data.positions;
      }, null);
    }, null); 
  }

  ngOnInit() {
  }

  getNames(query: string) {
    if (query == '') {
      return of({results: []});
    }
    return this.requestService.get("search/names", {'full_name': query});
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
    for (let candidate of this.candidates) {
      this.candidateModel[candidate.username] = false;
    }
  }

  addCandidatePhoto(username, i){
    let uri = '/profile/' + CURRENT_YEAR + '/' + username;
    this.requestService.get(uri).subscribe((data) => {
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

  getCandidates(position_id) {
    // delete past candidates
    this.candidateModel = {};
    this.writeInModel.writeIn1 = null;

    // get next set of candidates
    this.requestService.get(('elections/election/' + this.election.id) + '/candidate', {position: position_id}).subscribe((data) => {
      this.candidates = data.candidates;
      let i = 0;
      for (let candidate of this.candidates) {
        this.addCandidatePhoto(candidate.username, i);
        i = i + 1;
      }
      this.buildCandidateModel();
      this.requestService.get('/elections/vote', {position: position_id}).subscribe((data) => {
        this.votes = data.votes;
        for(let vote of data.votes) {
          let isCandidate = false; 
          for(let candidate of this.candidates) {
            if(vote.vote == candidate.username) {
              this.candidateModel[candidate.username] = true;
              isCandidate = true; 
            }
          }
          // assign vote to writeIn
          if (!isCandidate) {
            this.writeInModel.writeIn1 = vote.vote;
          }
        }
        // switches request to put
        if(data.votes.length != 0){
          this.hasVoted = true;  
        }
      }, null);
    }, (error) => {})
  }

  submitVote(position_id) {
    // submite vote
    let requestBody = {
      election: this.election.id,
      position: position_id,
      vote: null
    }
    // determine who was voted for
    for (let candidate in this.candidateModel) {
      if (this.candidateModel[candidate] == true) {
        requestBody.vote = candidate;
        break;
      }
    }
    //check for write in
    if(this.writeInModel.writeIn1 != null){
      requestBody.vote = this.writeInModel.writeIn1;
    }
    // dont make request if there was no one voted for
    if(requestBody.vote == null) {
      return;
    }
    // submit vote
    if(this.hasVoted == false) {
      let postURI = 'elections/vote';
      this.requestService.post(postURI, requestBody).subscribe(null, (error) => {
        this.submissionSuccess = false
      });
    }
     //changing vote
    if(this.hasVoted == true) {
      requestBody['id'] = this.votes[0].id;
      requestBody['username'] = this.votes[0].username;
      let voteId = null
      for (let vote of this.votes) {
        if (vote.position == position_id) {
          voteId = vote.id;
          break;
        }
      }
      let putURI = 'elections/vote/' + voteId;
      this.requestService.put(putURI, requestBody).subscribe(null, (error) => {
        this.submissionSuccess = false
      });
    }
  }

  nextPage() {
    this.pageNumber++;
    window.scrollTo(0,0);
  }

  startOver() {
    // hide pages
    this.pageNumber=null;
    //reset models
    this.candidateModel = {};
    this.writeInModel.writeIn1 = null;
    this.submissionSuccess = true;
    // go to first page
    this.pageNumber = 0;
    window.scrollTo(0,0);
  }


  valueChange($event, username){
    this.candidateModel[username] = $event;
  }

  // Function that allows only one writeIn or candidate to be selected at a time
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
    if (numSelected >= 1) {
      if (isCandidate) {
        return this.candidateModel[name];
      } else {
        return (Boolean(name));
      }
    } else {
      return true;
    }
  }
}