import { Component, OnInit } from '@angular/core';

import { AdminTableComponent } from 'src/app/shared/admin/admin';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  tabs: string[] = [
    'Elections',
    'Positions',
    'Candidates'
  ];

  constructor() { }



  ngOnInit() {
  }

}
