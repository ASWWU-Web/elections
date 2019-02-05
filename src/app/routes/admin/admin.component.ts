import { Component, OnInit } from '@angular/core';
import { RequestService } from 'src/shared-ng/services/services';
import { forkJoin } from 'rxjs';

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
  active: boolean; // this may need to be a string
  order: number; // this may need to be a string
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  electionsData: Election[];
  positionsData: Position[];

  constructor(private rs: RequestService) { }

  ngOnInit() {
    const electionsObservable = this.rs.get('elections/election');
    const positionsObservable = this.rs.get('elections/position');
    forkJoin([electionsObservable, positionsObservable]).subscribe(
      (data: [{elections: Election[]}, {positions: Position[]}]) => {
        this.electionsData = data[0].elections;
        this.positionsData = data[1].positions;
        console.log(this.positionsData);
      }, (err) => {
        console.error('Unable to fetch data for elections and/or positions');
      }
    );
  }

}
