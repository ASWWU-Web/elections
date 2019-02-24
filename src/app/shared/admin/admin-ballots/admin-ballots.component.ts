import { Component, OnInit, Input } from '@angular/core';
import { RequestService } from 'src/shared-ng/services/services';
import { Candidate } from 'src/app/shared/admin/admin-candidates/admin-elections-candidate-modal.component';

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

interface BallotPOST {
  election: string;
  position: string;
  student_id: string;
  vote: string;
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

  constructor(private rs: RequestService) { }

  ngOnInit() {
  }

  onSelectElection(election: number): void {
    // get the candidates for the newly selected election
    const getUrl = 'elections/election/' + this.electionsData[election].id + '/candidate';
    this.rs.get(getUrl).subscribe((data) => {
      // update candidates array
      this.candidatesData = data.candidates;
    }, (error) => {
      console.error('could not get candidates for selected election');
    });
    // clear the candidates array
    this.candidatesData = [];
    // set the selected election
    this.selectedElection = this.electionsData[election];
    // filter all the available positions
    this.availablePositions = this.positionsData.filter(position => position.election_type === this.selectedElection.election_type);
  }

  onSaveBallot(ballot: BallotPOST) {
    console.log(ballot);
  }
}
