import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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

interface Election {
  id: string;
  election_type: string;
  start: string;
  end: string;
  show_results: string;
}

interface Position {
  id: string;
  position: string;
  election_type: string;
  active: boolean;
  order: number;
}

@Component({
  selector: 'multi-position-handler',
  templateUrl: './multi-position-handler.component.html',
  styleUrls: ['./multi-position-handler.component.css']
})
export class MultiPositionHandlerComponent implements OnInit {
  // request data
  @Input() election: Election = null;  // the current election
  @Input() positions: Position[] = [];  // the list of district positions
  // completion emitter
  @Output() onComplete: EventEmitter<null> = new EventEmitter<null>();

  // member variables
  currentPosition: number = 0;  // current position being voted for

  dummyPosition: Position = {
    id: 'position-id-blah',
    position: 'position BlAh',
    election_type: 'aswwu',
    active: true,
    order: 0
  };
  dummyElection: Election = {
    id: 'election-id-blah',
    election_type: 'aswwu',
    start: '2019-02-12 15:37:30.000000',
    end: '2019-03-01 15:00:00.000000',
    show_results: '2019-03-01 15:00:00.000000'
  };

  constructor() { }

  ngOnInit() {
  }

  nextPosition() {
    // go to the next position to vote for
    if (this.currentPosition + 1 < this.positions.length) {
      this.currentPosition++;
    // got to the completion page
    } else {
      this.onComplete.emit();
    }
  }

}
