// https://alligator.io/angular/reactive-forms-formarray-dynamic-fields/

import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';

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
  candidates: Candidate[];
  formGroup: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.formGroup = this.formGroupFactory();
  }

  formGroupFactory() {// : FormGroup {
    function writeInArrayFactory(fb, numVotes) {
      const writeInArrayItem = fb.group({
        writeIn: ''
      });
      const writeInArray = new Array(numVotes);
      writeInArray.fill(writeInArrayItem);
      return writeInArray;
    }

    const writeInsFormGroup = this.fb.group({
      writeInArray: this.fb.array( writeInArrayFactory(this.fb, this.election.max_votes) )
    });

    return writeInsFormGroup;
  }

  getCandidates() {
  }

  submit() {
  }



}
