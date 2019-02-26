import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Position } from 'src/shared-ng/interfaces/elections';


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
  selectedDistrict: number = null;  // the currently selectied district
  districtFormGroup: FormGroup;  // the form group controller for choosing a district

  constructor() { }

  ngOnInit() {
    this.districtFormGroup = new FormGroup({
      district: new FormControl()
    })
  }

  // change selected district
  districtSelect(district: number) {
    this.selectedDistrict = district;
    this.onDistrictSelect.emit(district);
  }

  // function to transition to the next page
  formComplete(transition: number) {
    this.onComplete.emit(transition);
  }
}
