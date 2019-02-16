import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Position, PageTransitions } from 'src/app/routes/vote/vote.component';


@Component({
  selector: 'district-selection',
  templateUrl: './district-selection.component.html',
  styleUrls: ['./district-selection.component.css']
})
export class DistrictSelectionComponent implements OnInit {
  // request data
  @Input() positions: Position[] = [];  // the list of district positions
  // completion emitters
  @Output() onDistrictSelect: EventEmitter<number> = new EventEmitter<number>();  // event emitter for district choosing
  @Output() onComplete: EventEmitter<number> = new EventEmitter<number>();  // event emitter for page transitions

  // member variables
  selectedDistrict: number = 0;  // the currently selectied district
  districtFormGroup: FormGroup;  // the form group controller for choosing a district

  constructor() { }

  ngOnInit() {
    this.districtFormGroup = new FormGroup({
      district: new FormControl()
    })
  }

  // change selected district
  districtSelect() {
    this.onDistrictSelect.emit(this.selectedDistrict);
  }

  // function to transition to the next page
  formComplete() {
    this.onComplete.emit(PageTransitions.NextPage);
  }

  // function to start over
  startOver() {
    this.onComplete.emit(PageTransitions.StartOver);
  }
}
