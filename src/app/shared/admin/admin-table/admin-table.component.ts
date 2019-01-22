import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-admin-table',
  templateUrl: './admin-table.component.html',
  styleUrls: ['./admin-table.component.css']
})

// interface ElectionType {
//   id: string;
//   election_type: string;
//   start: string;
//   end: string;
// }

// interface PositionType {
//   id: string;
//   position: string;
//   election_type: string;
//   active: boolean; // this may need to be a string
//   order: number; // this may need to be a string
// }

// interface CandidateType {
//   id: string;
//   election: string;
//   position: string;
//   username: string;
//   display_name: string;
// }

export class AdminTableComponent implements OnInit {

  @Input() viewMode: string;
  @Input() actions = [
    'edit',
    'delete'
  ];
  data = [
    {
      id: 'e7c5c84f-0a58-4f3b-8490-14ee0737d96f',
      election_type: 'aswwu',
      start: '2018-11-05 08:00:00.000000',
      end: '2018-11-05 20:00:00.000000'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
