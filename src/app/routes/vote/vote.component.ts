import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../../shared-ng/services/request.service';

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

// switch states
enum Switches {
  Loading = 0,
  Start = 1,
  District = 2,
  Vote = 3,
  Complete = 4
}

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css']
})
export class VoteComponent implements OnInit {
  // switch data
  Switches = Switches;  // include switch enum
  switchState: number = Switches.Loading;  // the switchable state of the view
  // request data
  election: Election = null;  // the current election
  positions: Position[] = [];  // the positions based on the election type

  constructor(private rs: RequestService) { }

  ngOnInit() {
    // get the current election
    this.rs.get('elections/current').subscribe((electionData) => {
      this.election = electionData;
      // get positions for the election type
      this.rs.get('elections/position', { election_type: this.election.election_type }).subscribe((positionData) => {
        this.positions = positionData.positions;
        this.switchState = Switches.Start;
      }, null);
    }, null);
  }

  // function called when the user presses start
  nextPage() {
    // console.log(this.switchState);
    // switch to district selection state
    if (this.switchState == Switches.Start && this.election.election_type == 'senate') {
      this.switchState = Switches.District;
    // switch to voting state
    } else if (this.switchState == Switches.Start && this.election.election_type != 'senate') {
      this.switchState = Switches.Vote;
    // start over if the function is called and the vote process is complete
    } else if (this.switchState == Switches.Complete) {
      this.startOver();
    // switch to the next state
    } else {
      this.switchState++;
    }
    // console.log(this.switchState);
  }

  // start the voting process over again
  startOver() {
    this.switchState = Switches.Loading;
    this.ngOnInit();
  }

  // function called when the user selects a district in a senate election
  districtSelected(positionIndex: number) {
    let position = this.positions[positionIndex];
    this.nextPage();
  }
}
