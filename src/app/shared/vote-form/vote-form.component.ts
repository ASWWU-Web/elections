// https://alligator.io/angular/reactive-forms-formarray-dynamic-fields/

import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { RequestService } from 'src/shared-ng/services/services';
import { CURRENT_YEAR, MEDIA_SM, DEFAULT_PHOTO } from 'src/shared-ng/config';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';

// election interface
interface Election {
  id: string;
  election_type: string;
  name: string;
  max_votes: number;
  start: string;
  end: string;
  show_results: string;
};
// position interface
interface Position {
  id: string;
  position: string;
  election_type: string;
  active: boolean;
  order: number;
}

interface Candidate {
  id: string;
  election: string;
  position: string;
  username: string;
  display_name: string;
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
  @Output() valueChange: EventEmitter<null> = new EventEmitter<null>();
  candidates: {info: Candidate, photoUri: string}[];
  formGroup: FormGroup;
  defaultPhoto: string;
  photosReady: boolean;

  constructor(private fb: FormBuilder, private rs: RequestService) {
    this.defaultPhoto = MEDIA_SM + '/' + DEFAULT_PHOTO;
    this.photosReady = false;
  }

  ngOnInit() {
    this.formGroup = this.formGroupFactory();
    this.setCandidates();
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

  search(text$: Observable<string>) {
    function getNames(query: string, rs) {
      if (query === '') {
        return of({results: []});
      }
      return rs.get('search/names', {'full_name': query});
    }

    let rs = this.rs;
    return text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((data) => getNames(data, rs)),
      map((data: {results: {username: string, full_name: string}[]}) => {
        return data.results.map((item) => item.username);
      })
    );
  }

  onSubmit() {
  }

  onReset() {
  }
}
