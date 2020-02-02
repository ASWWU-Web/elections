import { Component, Input, OnInit } from '@angular/core';
import * as momentTz from 'moment-timezone';

/**
 * A countdown timer that counts down the amount of time until a
 * particular date. Has a time for when the countdown expires, the current time,
 * and the status of the timer.
 */
@Component({
  selector: 'countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.css']
})
export class CountdownComponent implements OnInit {
  /** Name for the countdown timer instance */
  @Input() name = 'default';

  /** Date to countdown to */
  @Input() date: momentTz;

  /** Current time and date */
  @Input() now: momentTz;

  /** Current status; 'upcoming' or 'now' */
  @Input() status: string;

  /**
   * Constructs the component instance
   */
  constructor() {
  }

  /**
   * Initializes the component instance
   */
  ngOnInit() {
    // Starts the countdown timer
    const difference = Math.abs(this.date - this.now);
    this.startTimer(difference);
  }

  /**
   * Returns the name of the countdown timer instance
   */
  getName() {
    return this.name;
  }

  /**
   * Returns string describing the status of the countdown
   */
  getDisplayStatus() {
    let displayStatus = '?';
    if (this.status === 'upcoming') {
      displayStatus = 'opens';
    } else if (this.status === 'now') {
      displayStatus = 'closes';
    }
    return displayStatus;
  }

  /**
   * Start the timer instance
   *
   * Inspired by {@link https://stackoverflow.com/questions/20618355/the-simplest-possible-javascript-countdown-timer}
   *
   * @param duration the length of to count for
   */
  startTimer(duration: number) {
    // Formats a period of time for display
    const format = function (period: number) {
      return period < 10 ? '0' + period : period;
    };

    // Init the amount of time in seconds until the timer expires
    let timer: number = duration / 1000;

    // Set an interval to update the display of the counter periodically
    window.setInterval(function (component) {
      // Update the display of the countdown
      const days: number = Math.floor(timer / 86400);
      const hours: number = Math.floor((timer % 86400) / 3600);
      const minutes: number = Math.floor((timer / 60) % 60);
      const seconds: number = Math.floor(timer % 60);
      const display = document.querySelector('.' + component.getName() + 'CountdownTimeDisplay');
      display.textContent = format(days) + 'd ' + format(hours) + 'h ' + format(minutes) + 'm ' + format(seconds) + 's';

      // Remove a second from the timer; if it has expired, reload the page
      if (--timer < 0) {
          window.location.reload();
      }
    }, 1000, this);
  }
}
