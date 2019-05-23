import { Component, OnInit } from '@angular/core';
import { ElectionsRequestService, AuthService } from '../../../shared-ng/services/services';
import { Router } from '@angular/router';
import * as momentTz from 'moment-timezone';
import * as moment from 'moment';
import { User } from 'src/shared-ng/interfaces/interfaces';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  status: string;
  admin: Boolean;

  // User roles
  roles = [''];
  response = null;
  isLoggedIn = false;
  router: any;
  dates = null;

  constructor(private ers: ElectionsRequestService, private as: AuthService,
              private _router: Router) {
    this.router = _router;
  }

  ngOnInit() {
    // verify the user is logged in
    this.as.getUserInfo().subscribe(
      (data: User) => {
        this.isLoggedIn = (data) ? true : false;
      }
    );
    this.isLoggedIn = this.as.isLoggedIn();
    // setup election options on landing page
    this.getCurrentElectionOptions();
    // check if the user is an admin
    if (this.roles.indexOf('admin') > -1) {
      this.admin = true;
    }
  }

  // Makes get request to elections/current to set up information for homepage
  getCurrentElectionOptions() {
    const electionsObservable = this.ers.readElectionCurrent();
    electionsObservable.subscribe((data) => {
      this.response = data;

      const serverTimeZone = 'America/Los_Angeles';
      const dateFormat = 'YYYY-MM-DD HH:mm:ss.SSSS';
      const localTimeZone = momentTz.tz.guess();

      const startDate = momentTz.tz(this.response['start'], serverTimeZone);
      startDate.tz(localTimeZone);
      const endDate = momentTz.tz(this.response['end'], serverTimeZone);
      endDate.tz(localTimeZone);

      const localNow = momentTz(momentTz(moment(), dateFormat).tz(localTimeZone).format(dateFormat), dateFormat, localTimeZone);

      this.dates = {};

      this.dates['start'] = startDate;
      this.dates['end'] = endDate;
      this.dates['now'] = localNow;


      if (startDate > this.dates['now']) {
        this.status = 'upcoming';
      } else {
        this.status = 'now';
      }
    }, (error) => {
      this.status = 'none';
    });
  }

  getDateTime(datetime) {
    const date = new Date(datetime);
    const options = { 'month': 'long', 'day': 'numeric', 'year': 'numeric', 'hour': 'numeric', 'minute': 'numeric' };
    return date.toLocaleString('en-US', options);
  }

}
