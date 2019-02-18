// https://alligator.io/angular/reactive-forms-formarray-dynamic-fields/

import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
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
  formGroup: FormGroup;
  defaultPhoto: string;
  serverErrorText: string;

  constructor(private fb: FormBuilder, private rs: RequestService) {
    this.defaultPhoto = MEDIA_SM + '/' + DEFAULT_PHOTO;
  }

  ngOnInit() {
    this.formGroup = this.formGroupFactory();
    this.setCandidates();
    this.setExistingVotes();
    this.serverErrorText = '';
  }

  formGroupFactory(): FormGroup {
    function writeInArrayFactory(fb, numVotes) {
      const writeInArray = Array.from({length: numVotes}, () => fb.group({writeIn: ''}));
      return writeInArray;
    }
    const writeInsFormGroup = this.fb.group({
      writeInArray: this.fb.array( writeInArrayFactory(this.fb, this.election.max_votes) )
    });
    return writeInsFormGroup;
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
    const votesObservable = this.rs.get('elections/vote', { position: this.position.id });
    votesObservable.subscribe(
      (data: {votes: Vote[]}) => {
        this.existingVotes = data.votes;
        if (this.existingVotes.length > this.election.max_votes) { console.error('There are too many votes in the database for this election!'); }
        this.existingVotes.forEach((existingVote, index) => {
          this.formGroup['controls'].writeInArray['controls'][index].controls.writeIn.setValue(existingVote.vote);
        });
      }, (err) => {
        // TODO (stephen)
      }, () => {
        // TODO (stephen)
      }
    );
  }

  fillWriteIn(candidateUsername) {
    // fill first empty write in slot with `candidateUsername`
    for (let index = 0; index < this.formGroup['value'].writeInArray.length; index++) {
      let writeIn = this.formGroup['value'].writeInArray[index];
      if (writeIn.writeIn === '' || !writeIn.writeIn) {
        this.formGroup['controls'].writeInArray['controls'][index].controls.writeIn.setValue(candidateUsername);
        return;
      } else if (writeIn.writeIn == candidateUsername) {
        return;
      }
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
      if (updateVote.vote !== '') {
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
        this.pageTransition(PageTransitions.NextPage);
      }, (err) => {
        // show user error text from the server
        console.log(err);
        this.serverErrorText = err.error.status;
      }, () => {
        // TODO (stephen)
      }
    );
  }
}
