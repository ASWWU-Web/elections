import { Component, OnInit, Input } from '@angular/core';
import { Type } from '@angular/compiler';

@Component({
  selector: 'app-admin-table',
  templateUrl: './admin-table.component.html',
  styleUrls: ['./admin-table.component.css']
})

interface ElectionType {
  id: string;
  election_type: string;
  start: string;
  end: string;
}

interface PositionType {
  id: string;
  position: string;
  election_type: string;
  active: boolean; // this may need to be a string
  order: number; // this may need to be a string
}

interface CandidateType {
  id: string;
  election: string;
  position: string;
  username: string;
  display_name: string;
}

export class AdminTableComponent implements OnInit {

  @Input() viewMode: string;
  dataType: Type;
  data: Array<T>;

  constructor() { }

  ngOnInit() {
  }

}
