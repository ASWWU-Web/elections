import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  status: string;
  admin: Boolean;

  response = {
    "id": "e7c5c84f-0a58-4f3b-8490-14ee0737d96f",
    "election_type": "senate",
    "start": "2018-12-07 08:00:00.000000",
    "end": "2018-12-07 20:00:00.000000"
  }

  // response = null;

  roles = ["admin"];

  constructor() { }

  ngOnInit() {
    if (this.roles.indexOf('admin') > -1) {
      this.admin = true;
    }

    if (this.response == null) {
      this.status = "none";
      return null;
    }

    let election_start = new Date(this.response["start"]);

    if (election_start.getTime() >= Date.now()) {
      this.status = "upcoming";
    } else {
      this.status = "now";
    }
  }

  getElectionType(election_type) {
    if (election_type=="aswwu") {
      return "ASWWU General Election";
    } 

    if (election_type=="senate") {
      return "Senate Election";
    }
  }

  getDateTime(datetime) {
    let date = new Date(datetime);
    let options = { 'month': 'long', 'day': 'numeric', 'year': 'numeric', 'hour': 'numeric', 'minute': 'numeric' };
    return date.toLocaleString('en-US', options);
  }

}
