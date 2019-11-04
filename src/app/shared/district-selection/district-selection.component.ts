import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Position, Election, Vote } from 'src/shared-ng/interfaces/elections';
import { ElectionsRequestService } from 'src/shared-ng/services/services';



@Component({
  selector: 'district-selection',
  templateUrl: './district-selection.component.html',
  styleUrls: ['./district-selection.component.css']
})
export class DistrictSelectionComponent implements OnInit {
  // request data
  @Input() positions: Position[] = [];  // the list of district positions
  @Input() election: Election;
  @Input() votes: Vote[] = [];

  // completion emitters
  @Output() onDistrictSelect: EventEmitter<number> = new EventEmitter<number>();  // event emitter for district choosing
  @Output() onComplete: EventEmitter<number> = new EventEmitter<number>();  // event emitter for page transitions

  // member variables
  selectedDistrict: number = null;  // the currently selected district
  districtFormGroup: FormGroup;  // the form group controller for choosing a district
  stagedVotes: {vote: Vote}[];

  constructor(private ers: ElectionsRequestService) {
    this.stagedVotes = [];
  }

  ngOnInit() {
    this.selectedDistrict = 0;
    this.onDistrictSelect.emit(this.selectedDistrict);
    for (const vote of this.votes) {
      this.stagedVotes.push({vote: vote});
    }
    this.districtFormGroup = new FormGroup({
      district: new FormControl()
    });
  }

  getPositionName(p: string) {
    for (const position of this.positions) {
      if (position.id === p) {
        return position.position;
      }
    }
  }

  // change selected district
  districtSelect(district: number) {
    this.selectedDistrict = district;
    this.onDistrictSelect.emit(district);
  }

  existingVote(district: Position) {
    if (district.position === this.stagedVotes[0].vote.position) {
      return false;
    }
    return true;
  }

  // function to transition to the next page
  formComplete(transition: number) {
    this.onComplete.emit(transition);
  }
}
