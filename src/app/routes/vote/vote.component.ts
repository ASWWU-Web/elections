import { Component, OnInit } from '@angular/core';
import { ElectionsRequestService } from 'src/shared-ng/services/elections.request.service';
import { Election, Position } from 'src/shared-ng/interfaces/elections';

// switch states
enum Switches {
  Loading = 0,
  Start = 1,
  District = 2,
  Vote = 3,
  Complete = 4
}
export enum PageTransitions {
  NextPage = 0,
  StartOver = 1,
  ASWWU = 2
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
  // transition states
  PageTransitions = PageTransitions;
  // request data
  election: Election = null;  // the current election
  positions: Position[] = [];  // the positions based on the election type
  visiblePositions: Position[] = [];  // the positions based on the election type

  constructor(private ers: ElectionsRequestService) { }

  ngOnInit() {
    // get the current election
    const electionObservable = this.ers.readElectionCurrent();
    electionObservable.subscribe((electionData) => {
      this.election = electionData;
      // get positions for the election type
      this.ers.get('elections/position', { election_type: this.election.election_type }).subscribe((positionData) => {
        this.positions = positionData.positions;
        this.visiblePositions = positionData.positions;
        this.switchState = Switches.Start;
      }, null);
    }, null);
  }

  // function called when the user presses start
  pageTransition(transition: number = PageTransitions.NextPage) {
    // normal page transition
    if (transition === PageTransitions.NextPage) {
      // switch to district selection state
      if (this.switchState === Switches.Start && this.election.election_type === 'senate') {
        this.switchState = Switches.District;
      // switch to voting state
      } else if (this.switchState === Switches.Start && this.election.election_type !== 'senate') {
        this.switchState = Switches.Vote;
      // start over if the function is called and the vote process is complete
      } else if (this.switchState === Switches.Complete) {
        this.startOver();
      // switch to the next state
      } else {
        this.switchState++;
      }
    // start over
    } else if (transition === PageTransitions.StartOver) {
      this.startOver();
    } else if (transition === PageTransitions.ASWWU) {
      window.location.href = 'https://aswwu.com';
    }
  }

  // function to start the voting process over
  private startOver() {
    this.switchState = Switches.Loading;
    this.ngOnInit();
  }

  // function called when the user selects a district in a senate election
  districtSelect(positionIndex: number) {
    this.visiblePositions = [this.positions[positionIndex]];
  }
}
