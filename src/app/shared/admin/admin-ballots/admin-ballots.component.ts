import { Component, OnInit, Input } from '@angular/core';
import { RequestService } from 'src/shared-ng/services/services';
import { Candidate } from 'src/app/shared/admin/admin-candidates/admin-elections-candidate-modal.component';

interface Election {
  id: string;
  election_type: string;
  start: string;
  end: string;
  show_results: string;
  name: string;
}

interface Position {
  id: string;
  position: string;
  election_type: string;
  active: boolean;
  order: number;
}

interface BallotPOST {
  election: string;
  position: string;
  student_id: string;
  vote: string;
}

interface Ballot {
  id: string;
  election: string;
  position: string;
  vote: string;
  student_id: string;
  manual_entry: string;
}

@Component({
  selector: 'app-admin-ballots',
  templateUrl: './admin-ballots.component.html',
  styleUrls: ['./admin-ballots.component.css']
})
export class AdminBallotsComponent implements OnInit {
  @Input() electionsData: Election[] = [];
  @Input() positionsData: Position[] = [];
  candidatesData: Candidate[] = [];
  selectedElection: Election = null;
  availablePositions: Position[] = [];
  ballots: Ballot[] = [];
  deleteState: number = null;

  constructor(private rs: RequestService) { }

  ngOnInit() {
  }

  onSelectElection(election: number): void {
    // get the candidates for the newly selected election
    const candidateUrl = 'elections/election/' + this.electionsData[election].id + '/candidate';
    this.rs.get(candidateUrl).subscribe((data) => {
      // update candidates array
      this.candidatesData = data.candidates;
    }, (error) => {
      console.error('could not get candidates for selected election');
    });
    // clear the candidates and ballots array
    this.candidatesData = [];
    this.ballots = [];
    // set the selected election
    this.selectedElection = this.electionsData[election];
    // get all existing ballots
    const ballotUrl = 'elections/election/' + this.selectedElection.id + '/ballot';
    this.rs.get(ballotUrl).subscribe((data) => {
      this.ballots = data.ballots;
    }, (error) => {
      console.error(error);
    });
    // filter all the available positions
    this.availablePositions = this.positionsData.filter(position => position.election_type === this.selectedElection.election_type);
  }

  onSaveBallot(ballot: BallotPOST) {
    const postUrl = 'elections/election/' + ballot.election + '/ballot';
    this.rs.post(postUrl, ballot).subscribe((data) => {
      // add response data to ballots array
      this.ballots.unshift(data);
    }, (error) => {
      console.error(error);
    });
  }

  prettyElectionType(electionType: string): string {
    if (electionType === 'aswwu') {
      return 'ASWWU';
    } else if (electionType === 'senate') {
      return 'Senate';
    }
    return electionType;
  }

  prettyUsername(username: string): string {
    return username.replace(/\./g, ' ');
  }

  idToPosition(positionId: string): string {
    return this.positionsData.find(p => p.id === positionId).position;
  }

  deleteConfirmation(index: number): void {
    // set delete state to confirm
    this.deleteState = index;
  }

  deleteBallot(index: number): void {
    // reset delete state
    this.deleteState = null;
    // delete ballot from the server
    const deleteUrl = 'elections/election/' + this.selectedElection.id + '/ballot/' + this.ballots[index].id;
    this.rs.delete(deleteUrl).subscribe(null, (error) => {
      console.error(error);
    });
    // delete ballot from local array
    this.ballots.splice(index, 1);
  }
}
