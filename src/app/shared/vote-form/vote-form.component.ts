// https://alligator.io/angular/reactive-forms-formarray-dynamic-fields/

import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { RequestService } from 'src/shared-ng/services/services';
import { CURRENT_YEAR, MEDIA_SM, DEFAULT_PHOTO } from 'src/shared-ng/config';
import { Observable, of, forkJoin } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';

import { Election, Position, PageTransitions } from 'src/app/routes/vote/vote.component';

interface Candidate {
  id: string;
  election: string;
  position: string;
  username: string;
  display_name: string;
}
interface Vote {
  id: string;
  election: string;
  position: string;
  vote: string;
  username: string;
}


@Component({
  selector: 'vote-form',
  templateUrl: './vote-form.component.html',
  styleUrls: ['./vote-form.component.css']
})
export class VoteFormComponent implements OnInit {
  // request data
  @Input() election: Election;  // the current election
  @Input() position: Position;  // the list of district positions
  // completion emitter
  @Output() valueChange: EventEmitter<number> = new EventEmitter<number>();

  candidates: {info: Candidate, photoUri: string}[] = [];
  existingVotes: Vote[];
  stagedVotes: string[];
  formGroup: FormGroup;
  defaultPhoto: string;
  serverErrorText: string;

  constructor(private fb: FormBuilder, private rs: RequestService) {
    this.defaultPhoto = MEDIA_SM + '/' + DEFAULT_PHOTO;
    this.formGroup = new FormGroup({writeIn: new FormControl('')});
  }

  ngOnInit() {
    this.setCandidates();
    this.setExistingVotes();
    this.serverErrorText = '';
  }

  setCandidates() {
    function setCandidatePhoto(username, index, rs, candidates) {
      const uri = '/profile/' + CURRENT_YEAR + '/' + username;
      const profileObservable = rs.get(uri);
      profileObservable.subscribe(
        (data) => {
          let photoUri = MEDIA_SM + '/';
          photoUri += (data.photo !== 'None') ? data.photo : null;
          candidates[index].photoUri = photoUri;
        }, (err) => {
          // TODO (stephen)
        }, () => {
          // TODO (stephen)
        }
      );
    }

    const getUri = 'elections/election/' + this.election.id + '/candidate';
    const getCandidatesObservable = this.rs.get(getUri, {position: this.position.id});
    getCandidatesObservable.subscribe(
      (data) => {
        let candidates = data.candidates;
        candidates = candidates.map((item: Candidate) => ({info: item, photoUri: ''}));
        this.candidates = candidates;
        this.candidates.forEach((candidate, index) => {
          setCandidatePhoto(candidate.info.username, index, this.rs, this.candidates);
        });
      }, (err) => {
        // TODO (stephen)
      }, () => {
        // TODO (stephen)
      }
    );
  }

  setExistingVotes() {
    function stageExistingVotes(existingVotes: Vote[]) {
      for (const vote of existingVotes) {
        this.stageVote(vote.vote);
      }
    }

    const votesObservable = this.rs.get('elections/vote', { position: this.position.id });
    votesObservable.subscribe(
      (data: {votes: Vote[]}) => {
        this.existingVotes = data.votes;
        stageExistingVotes(this.existingVotes);
      }, (err) => {
      }, () => {
      }
    );
  }

  stageVote(candidateUsername) {
    if (!this.stagedVotes.includes(candidateUsername)) {
      this.stagedVotes.push(candidateUsername);
    }
  }

  getNames(query: string) {
    if (query === '') {
      return of({results: []});
    }
    return this.rs.get('search/names', {'full_name': query});
  }

  search = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((data) => this.getNames(data)),
      map((data: {results: {username: string, full_name: string}[]}) => {
        return data.results.map((item) => item.username);
      })
    );
  }

  stageWriteIn() {
    let writeIn = null; // get this from the formgroup
    if (writeIn) {
      this.stageVote(writeIn);
    }
  }

  pageTransition(transition: number) {
    this.valueChange.emit(transition);
  }

  buildRequestArrayObservable() {
    let updatableVotes: Vote[] = this.existingVotes;
    let unsubmittedVotes: string[] = (this.formGroup['controls'].writeInArray['controls']).map((control) => control.value.writeIn);

    let requestArray = [];
    for (let updatableVote of updatableVotes) {
      let updateVote = Object.assign({}, updatableVote);
      updateVote.vote = unsubmittedVotes.shift();
      if (updateVote.vote !== '' && updateVote.vote != null) {
        requestArray.push(this.rs.put('elections/vote/' + updateVote.id, updateVote));
      }
    }

    for (let unsubmittedVote of unsubmittedVotes) {
      let newVote = {
        election: this.election.id,
        position: this.position.id,
        vote: unsubmittedVote
      };
      if (newVote.vote !== '') {
        requestArray.push(this.rs.post('elections/vote', newVote));
      }
    }

    return forkJoin(requestArray);
  }

  onSubmit() {
    let requestArrayObservable = this.buildRequestArrayObservable();
    requestArrayObservable.subscribe(
      (data) => {
        this.serverErrorText = '';
      }, (err) => {
        // show user error text from the server
        console.log(err);
        this.serverErrorText = 'Something went wrong, make sure all entered usernames are valid.';
        this.pageTransition(PageTransitions.NextPage);
      }, () => {
        this.pageTransition(PageTransitions.NextPage);
      }
    );
  }

  callBackTest() {
    console.log(this.election.id);
  }
}
