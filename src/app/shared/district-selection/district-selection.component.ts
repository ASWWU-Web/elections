import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

// election interface
interface Election {
  id: string,
  election_type: string,
  name: string,
  max_votes: number,
  start: string,
  end: string,
  show_results: string
};
// position interface
interface Position {
  id: string,
  position: string,
  election_type: string,
  active: boolean,
  order: number
}

@Component({
  selector: 'district-selection',
  templateUrl: './district-selection.component.html',
  styleUrls: ['./district-selection.component.css']
})
export class DistrictSelectionComponent implements OnInit {
  @Input() election: Election = null;  // the current election
  @Input() positions: Position[] = [];  // the list of district positions
  @Output() onComplete: EventEmitter<number> = new EventEmitter<number>();  // event emitter for distric choosing

  selectedDistrict: number = 0;  // the currently selectied district
  districtFormGroup: FormGroup;  // the form group controller for choosing a district

  constructor() { }

  ngOnInit() {
    console.log(this.positions);
    this.districtFormGroup = new FormGroup({
      district: new FormControl()
    })
  }

  // function to confirm the district selection and emit the district chosen to the parents
  formComplete() {
    this.onComplete.emit(this.selectedDistrict);
  }
}
