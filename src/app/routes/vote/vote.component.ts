import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../../shared-ng/services/request.service';


@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css']
})
export class VoteComponent implements OnInit {
  election_type: string = 'senate'

  constructor(private rs: RequestService) { }

  ngOnInit() {
    this.rs.get('elections/current').subscribe((data) => {
      this.election_type = data.election_type;
    }, null);
  }

}
