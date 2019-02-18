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
  isLoggedIn: boolean = false;
  router: any;
  now = Date.now();
  dates = null;
  startTime = null;

  constructor(private rs: RequestService, private _router: Router) {
    this.router = _router;
  }

  ngOnInit() {
    // verify the user is logged in
    this.rs.verify((data) => {
      this.isLoggedIn = this.rs.isLoggedOn();
    });
    // setup election options on landing page
    this.getCurrentElectionOptions();
    // check if the user is an admin
    if (this.roles.indexOf('admin') > -1) {
      this.admin = true;
    }
  }

  // Makes get request to elections/current to set up information for homepage
  getCurrentElectionOptions() {
    this.rs.get('elections/current').subscribe((data) => {
      this.response = data;

      // Converts date string into an array of numbers, as different browsers support different formats for dates
      var arrStart = this.response['start'].split(/[- :]/).map(Number), arrEnd = this.response['end'].split(/[- :]/).map(Number);

      var dateStart = new Date(arrStart[0], arrStart[1]-1, arrStart[2], arrStart[3], arrStart[4], arrStart[5]);
      var dateEnd = new Date(arrEnd[0], arrEnd[1]-1, arrEnd[2], arrEnd[3], arrEnd[4], arrEnd[5]);

      this.dates = {};

      this.dates["start"] = dateStart;
      this.dates["end"] = dateEnd;

      this.startTime = this.dates['start'].getTime();


      if (this.startTime > Date.now()) {
        this.status = "upcoming";
      } else {
        this.status = "now";
      }
    }, (error)=> {
      this.status = "none";
    });
  }

  getDateTime(datetime) {
    let date = new Date(datetime);
    let options = { 'month': 'long', 'day': 'numeric', 'year': 'numeric', 'hour': 'numeric', 'minute': 'numeric' };
    return date.toLocaleString('en-US', options);
  }

}
