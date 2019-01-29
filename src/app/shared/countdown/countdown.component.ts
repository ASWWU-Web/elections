import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.css']
})
export class CountdownComponent implements OnInit {
  @Input() dates;
  @Input() status: string;

  constructor() { }

  ngOnInit() {
    this.timerInit(this.dates['start']);
    console.log("FIRST STATUS", this.status);
  }

  updateTimer() {
    if (this.status == "upcoming") {
      this.status = "now";
      this.timerInit(this.dates['end']);
    } else if (this.status == "now") {
      this.status = "none";
    } 

    console.log("STATUS", this.status);
  }

  timerInit(date: Date) {
    console.log("DATE: ", date);
    var display = document.querySelector('#time');
    var difference = Math.abs(Date.now() - date.getTime());

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
          this.updateTimer();
          //window.location.reload(true);
        }
    }, 1000);
  }
}
