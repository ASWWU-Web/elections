import { Component, OnInit } from '@angular/core';
import { ElectionsRequestService } from '../../../shared-ng/services/services';
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
  roles = [''];
  response = null;
  isLoggedIn = false;
  router: any;
  now = Date.now();
  dates = null;
  startTime = null;

  constructor(private ers: ElectionsRequestService, private _router: Router) {
    this.router = _router;
  }

  ngOnInit() {
    // verify the user is logged in
    this.ers.verify((data) => {
      this.isLoggedIn = this.ers.isLoggedOn();
    });
    // setup election options on landing page
    this.getCurrentElectionOptions();
    // check if the user is an admin
    if (this.roles.indexOf('admin') > -1) {
      this.admin = true;
    }
  }

  // TODO: Ask stephen about what to do here
  // Makes get request to elections/current to set up information for homepage
  getCurrentElectionOptions() {
    const electionsObservable = this.ers.readElectionCurrent();
      electionsObservable.subscribe((data) => {
        // this is undefined
      this.response = data;
      console.log(this.response);
      // Converts date string into an array of numbers, as different browsers support different formats for dates
      const arrStart = this.response['start'].split(/[- :]/).map(Number), arrEnd = this.response['end'].split(/[- :]/).map(Number);

      const dateStart = new Date(arrStart[0], arrStart[1] - 1, arrStart[2], arrStart[3], arrStart[4], arrStart[5]);
      const dateEnd = new Date(arrEnd[0], arrEnd[1] - 1, arrEnd[2], arrEnd[3], arrEnd[4], arrEnd[5]);

      this.dates = {};

      this.dates['start'] = dateStart;
      this.dates['end'] = dateEnd;

      this.startTime = this.dates['start'].getTime();


      if (this.startTime > Date.now()) {
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
