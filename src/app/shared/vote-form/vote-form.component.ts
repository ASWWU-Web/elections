// https://alligator.io/angular/reactive-forms-formarray-dynamic-fields/

import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { RequestService } from 'src/shared-ng/services/services';
import { CURRENT_YEAR, MEDIA_SM, DEFAULT_PHOTO } from 'src/shared-ng/config';
import { Observable, of, forkJoin } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';

import { Election, Position, PageTransitions } from 'src/app/routes/vote/vote.component';
import { updateBinding } from '@angular/core/src/render3/instructions';

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
  stagedVotes: {vote: Vote, toDelete: boolean}[]; // only ever set toDelete to true if it also exists on the server (vote.id != null)
  formGroup: FormGroup;
  defaultPhoto: string;
  numVotesToKeep: number;
  serverErrorText: string;

  constructor(private fb: FormBuilder, private rs: RequestService) {
    this.defaultPhoto = MEDIA_SM + '/' + DEFAULT_PHOTO;
    this.formGroup = new FormGroup({writeIn: new FormControl('')});
    this.stagedVotes = [];
    this.numVotesToKeep = 0;
  }

  ngOnInit() {
    this.setCandidates();
    this.stageExistingVotes();
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

  stageExistingVotes() {
    const votesObservable = this.rs.get('elections/vote', { position: this.position.id });
    votesObservable.subscribe(
      (data: {votes: Vote[]}) => {
        const existingVotes = data.votes;
        for (const vote of existingVotes) {
          this.stageVote(vote);
        }
      }, (err) => {
      }, () => {
      }
    );
  }

  indexOfObj(array, propertyPath: string[], value) {
    function getDeepPropertyValue(object, localPropertyPath: string[]) {
      // access a property deep in an object
      let propertyValue = object;
      for (const property of localPropertyPath) {
        if (propertyValue[property]) {
          propertyValue = propertyValue[property];
        } else {
          return;
        }
      }
      return propertyValue;
    }

    let index = -1;
    array.forEach((element, i) => {
      const elementPropertyValue = getDeepPropertyValue(element, propertyPath);
      if (elementPropertyValue && elementPropertyValue === value) {
        index = i;
      }
    });
    return index;
  }

  updateNumVotesToKeep() {
    let newNumVotesToKeep = 0;
    for (let vote of this.stagedVotes) {
      if (!vote.toDelete) {
        newNumVotesToKeep += 1;
      }
    }
    this.numVotesToKeep = newNumVotesToKeep;
  }

  stageVote(vote: Vote) {
    // early exit, cancel if staging the vote would exceed max_votes
    if (this.numVotesToKeep + 1 > this.election.max_votes) {
      return;
    }
    // look for a vote in staged votes with the same username as the passed in vote
    // if no vote is staged by that name, stage the vote, otherwise,
    // just make sure the vote isn't set to be deleted.
    const candidateUsername = vote.vote;
    const stagedVoteIndex = this.indexOfObj(this.stagedVotes, ['vote', 'vote'], candidateUsername);
    if (stagedVoteIndex === -1) {
      const voteToStage = {
        vote: vote,
        toDelete: false
      };
      this.stagedVotes.push(voteToStage);
      // this.numVotesToKeep = this.numVotesToKeep + 1;
    } else {
      this.stagedVotes[stagedVoteIndex].toDelete = false;
    }
    this.updateNumVotesToKeep();
  }

  stageVoteRemoval(stagedVoteIndex) {
    // stages a vote removal or removes a vote from stagedVotes if it doesn't exist on the server
    const index = stagedVoteIndex;
    if (stagedVoteIndex < this.stagedVotes.length && stagedVoteIndex >= 0) {
      if (this.stagedVotes[index].vote.id) {
        this.stagedVotes[index].toDelete = true;
      } else {
        this.stagedVotes.splice(index, 1);
      }
    }
    this.updateNumVotesToKeep();
  }

  onDeleteVoteButton(stagedVoteIndex) {
    const index = stagedVoteIndex;
    if (index < this.stagedVotes.length && index >= 0) {
      if (this.stagedVotes[index].toDelete) {
        this.stageVote(this.stagedVotes[index].vote);
      } else {
        this.stageVoteRemoval(index);
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

  stageWriteIn() {
    const writeIn = this.formGroup.value.writeIn;
    if (writeIn) {
      const voteToStage: Vote = {
        id: null, // this should be filled in when we submit if we end up updating a vote
        election: this.election.id,
        position: this.position.id,
        username: null, // this should be filled in when we submit if we end up updating a vote
        vote: writeIn
      };
      this.stageVote(voteToStage);
    }
  }

  stageUsername(candidateUsername) {
    const voteToStage: Vote = {
      id: null,
      election: this.election.id,
      position: this.position.id,
      username: null,
      vote: candidateUsername
    }
    this.stageVote(voteToStage);
  }

  pageTransition(transition: number) {
    this.valueChange.emit(transition);
  }

  buildRequestArrayObservable() {
    let updatableVotes: {vote: Vote, toDelete: boolean}[] = [];
    let newVotes: Vote[] = [];

    // sort votes into new votes and votes that can be updated or deleted
    for (let vote of this.stagedVotes) {
      if (vote.vote.id && vote.toDelete) {
        updatableVotes.push(vote);
      } else if ( !vote.vote.id ) {
        newVotes.push(vote.vote);
      } else {
        // do nothing, this means the current vote exists on the server, but will not be deleted or overwritten
      }
    }

    let requestArray = [];
    for (let i = 0; i < updatableVotes.length || i < newVotes.length; i++) {
      if (i < updatableVotes.length && i < newVotes.length) {
        const updatableVote: Vote = updatableVotes[i].vote;
        updatableVote.vote = newVotes[i].vote;
        requestArray.push(this.rs.put('elections/vote/' + updatableVote.id, updatableVote));
      } else {
        if (i < updatableVotes.length) {
          // toDelete.push(updatableVotes[i].vote);
          requestArray.push(this.rs.delete('elections/vote/' + updatableVotes[i].vote.id));
        } else if (i < newVotes.length) {
          // toPost.push(newVotes[i]);
          const voteToPost = {
            election: this.election.id,
            position: this.position.id,
            vote: newVotes[i].vote
          };
          requestArray.push(this.rs.post('elections/vote', voteToPost));
        } else {
          console.error('buildRequestArrayObservable second sort, this error should never happen.');
        }
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
}
