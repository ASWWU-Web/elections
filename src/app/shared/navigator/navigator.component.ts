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
  // navigation button event emitters
  @Output() onClickPrimary: EventEmitter<number> = new EventEmitter<number>();
  @Output() onClickDanger: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
  }

  primaryClick() {
    this.onClickPrimary.emit(this.primaryEvent);
  }

  dangerClick() {
    this.onClickDanger.emit(this.dangerEvent);
  }
}
