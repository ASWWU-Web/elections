import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { PageTransitions } from 'src/app/routes/vote/vote.component'


@Component({
  selector: 'navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.css']
})
export class NavigatorComponent implements OnInit {
  // The name of the buttons, if set to null the buttons will not appear
  @Input() primaryName: string = null;
  @Input() dangerName: string = null;
  // the events to emit on click
  @Input() primaryEvent: number = PageTransitions.NextPage;
  @Input() dangerEvent: number = PageTransitions.StartOver;
  // button enabled/disabled states
  @Input() primaryDisabled: boolean = false;
  @Input() dangerDisabled: boolean = false;
  // navigation button event emitters
  @Output() onButtonClick: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
    // scroll to the top of the window after page transition
    scrollTo(0, 0);
  }

  primaryClick() {
    if (this.primaryEvent != null) {
      this.onButtonClick.emit(this.primaryEvent);
    }
  }

  dangerClick() {
    if (this.dangerEvent != null) {
      this.onButtonClick.emit(this.dangerEvent);
    }
  }
}
