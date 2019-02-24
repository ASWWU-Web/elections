import { Component, OnInit, Input } from '@angular/core';
import { RequestService } from 'src/shared-ng/services/services';
import { Election, Position } from 'src/app/routes/admin/admin.component';
import { Candidate } from 'src/app/shared/admin/admin-candidates/admin-elections-candidate-modal.component';

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
  }
}
