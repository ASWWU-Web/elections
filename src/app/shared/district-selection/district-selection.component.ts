import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Position } from 'src/app/routes/vote/vote.component';


@Component({
  selector: 'district-selection',
  templateUrl: './district-selection.component.html',
  styleUrls: ['./district-selection.component.css']
})
export class DistrictSelectionComponent implements OnInit {
  // request data
  @Input() positions: Position[] = [];  // the list of district positions
  // completion emitter
  @Output() onComplete: EventEmitter<number> = new EventEmitter<number>();  // event emitter for distric choosing

  // member variables
  selectedDistrict: number = 0;  // the currently selectied district
  districtFormGroup: FormGroup;  // the form group controller for choosing a district

  constructor() { }

  ngOnInit() {
    this.districtFormGroup = new FormGroup({
      district: new FormControl()
    })
  }

  // function to confirm the district selection and emit the district chosen to the parents
  formComplete() {
    this.onComplete.emit(this.selectedDistrict);
  }
}
