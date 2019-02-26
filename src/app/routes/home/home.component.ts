import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../../shared-ng/services/request.service';
import { Router } from '@angular/router';
import * as momentTz from 'moment-timezone';
import * as moment from 'moment';


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
  dates = null;

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

      const serverTimeZone = 'America/Los_Angeles';
      const dateFormat = 'YYYY-MM-DD HH:mm:ss.SSSS';
      const localTimeZone = momentTz.tz.guess();

      var startDate = momentTz.tz(this.response['start'], serverTimeZone);
      startDate.tz(localTimeZone);
      var endDate = momentTz.tz(this.response['end'], serverTimeZone);
      endDate.tz(localTimeZone);

      var localNow = momentTz(momentTz(moment(), dateFormat).tz(localTimeZone).format(dateFormat), dateFormat, localTimeZone);

      this.dates = {};

      this.dates["start"] = startDate;
      this.dates["end"] = endDate;
      this.dates["now"] = localNow;


      if (startDate > this.dates["now"]) {
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
