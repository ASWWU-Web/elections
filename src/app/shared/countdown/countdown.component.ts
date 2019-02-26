import { Component, Input, OnInit } from '@angular/core';
import * as momentTz from 'moment-timezone';

@Component({
  selector: 'countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.css']
})
export class CountdownComponent implements OnInit {
  @Input() date: momentTz;
  @Input() now: momentTz;
  @Input() status: string;

  constructor() { }

  ngOnInit() {
    var display = document.querySelector('#time');
    var difference = Math.abs(this.date - this.now);

    this.startTimer(difference, display);
  }

  // Returns string depending on whether the election will be opening or closing in X time
  getStatus() {
    if (this.status == "upcoming") {
      return "opens";
    }
    if (this.status == "now") {
      return "closes";
    }
  }

  // duration = time in seconds, display = id to display to 
  // Source: https://stackoverflow.com/questions/20618355/the-simplest-possible-javascript-countdown-timer 
  startTimer(duration, display) {
    duration = duration / 1000;
    var timer = duration, days, hours, minutes, seconds;
    setInterval(function () {
        days = Math.floor(timer / 86400);
        hours = Math.floor((timer % 86400) / 3600);
        minutes = Math.floor((timer / 60) % 60);
        seconds = Math.floor(timer % 60);

        days = days < 10 ? "0" + days : days;
        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = days + "d " + hours + "h " + minutes + "m " + seconds + "s";

        if (--timer < 0) {
            window.location.reload(true);
        }
    }, 1000);
  }
}
