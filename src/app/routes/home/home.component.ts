import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../../shared-ng/services/request.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  status: string;
  admin: Boolean;
  // User roles
  roles = [""];
  response = null;
  // response = {
  //   "id": "e7c5c84f-0a58-4f3b-8490-14ee0737d96f",
  //   "election_type": "senate",
  //   "start": "2018-12-07 08:00:00.000000",
  //   "end": "2018-12-07 20:00:00.000000"
  // }
  isLoggedIn: Boolean = false;
  router: any;


  constructor(private rs: RequestService, private _router: Router) {
    this.router = _router;
  }

  ngOnInit() {
    this.getResponse(); 

    if (this.roles.indexOf('admin') > -1) {
      this.admin = true;
    }
  }

  // Makes get request to elections/current to set up information for homepage
  getResponse() {
    this.rs.get('elections/current').subscribe((data) => {
      this.response = data;

      console.log(this.response);

      let election_start = new Date(this.response['start']);

      if (election_start.getTime() >= Date.now()) {
        this.status = "upcoming";
      } else {
        this.status = "now";
      }

      // Checks to see if user is logged in; changes "vote" button to "log in" in html if user not logged in
      this.isLoggedIn = this.rs.isLoggedOn();
    }, (error)=> {
      this.status = "none";
    });

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
