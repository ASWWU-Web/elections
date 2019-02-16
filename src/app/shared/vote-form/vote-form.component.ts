import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

import { Election, Position } from 'src/app/routes/vote/vote.component';


@Component({
  selector: 'vote-form',
  templateUrl: './vote-form.component.html',
  styleUrls: ['./vote-form.component.css']
})
export class VoteFormComponent implements OnInit {
    // request data
    @Input() election: Election = null;  // the current election
    @Input() position: Position = null;  // the list of district positions
    // completion emitter
    @Output() valueChange: EventEmitter<null> = new EventEmitter<null>();

  constructor() { }

  ngOnInit() {
  }

}
