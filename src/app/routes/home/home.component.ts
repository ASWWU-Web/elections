import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  status: string = "upcoming"
  //currentDate: Date.now()

  response = {
    "id": "e7c5c84f-0a58-4f3b-8490-14ee0737d96f",
    "election_type": "aswwu",
    "start": "2018-11-05 08:00:00.000000",
    "end": "2018-11-05 20:00:00.000000"
  }

  constructor() { }

  ngOnInit() {
  }

  getDateTime(datetime) {
    let date = new Date(datetime);
    let options = { 'month': 'long', 'day': 'numeric', 'year': 'numeric', 'hour': 'numeric', 'minute': 'numeric' };
    return date.toLocaleString('en-US', options);
  }

}
