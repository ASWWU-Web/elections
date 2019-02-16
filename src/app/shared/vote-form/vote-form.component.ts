import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

// election interface
interface Election {
  id: string,
  election_type: string,
  name: string,
  max_votes: number,
  start: string,
  end: string,
  show_results: string
};
// position interface
interface Position {
  id: string,
  position: string,
  election_type: string,
  active: boolean,
  order: number
}

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
