import { Component, OnInit, Output, Input } from '@angular/core';
import { NgbModal, NgbModalRef, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Candidate } from 'src/app/shared/admin/admin-candidates/admin-elections-candidate-modal.component';

interface Election {
  id: string;
  election_type: string;
  start: string;
  end: string;
  show_results: string;
  max_votes: number;
}

interface Position {
  id: string;
  position: string;
  election_type: string;
  active: boolean;
  order: number;
}

export interface BallotPOST {
  election: string;
  position: string;
  student_id: string;
  vote: string;
}

@Component({
  selector: 'app-ballot-modal-content',
  templateUrl: './admin-ballot-modal.component.html',
  styleUrls: ['./admin-ballot-modal.component.css']

})
export class AdminBallotModalContentComponent implements OnInit {
  @Input() selectedElection: Election = null;
  @Input() positionsData: Position[] = [];
  @Input() candidateData: Candidate[] = [];
  @Output() saveBallot: EventEmitter<FormGroup> = new EventEmitter();
  ballotForm: FormGroup;

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder) { }

  ngOnInit() {
    // set up the ballot form
    this.ballotForm = this.fb.group({
      studentID: [''],
      positions: this.fb.array([])
    });
    this.setPositions();
  }

  setPositions(): void {
    const control = <FormArray>this.ballotForm.controls.positions;
    this.positionsData.forEach(position => {
      control.push(this.fb.group({
        candidates: this.setCandidates(position),
        writeins: this.setWriteIns()
      }));
    });
  }

  setCandidates(position: Position): FormArray {
    const arr = new FormArray([]);
    this.getCandidates(position).forEach(() => {
      arr.push(this.fb.group({
        candidate: false
      }));
    });
    return arr;
  }

  setWriteIns(): FormArray {
    const arr = new FormArray([]);
    for (let w = 0; w < this.selectedElection.max_votes; w++) {
      arr.push(this.fb.group({
        writein: ''
      }));
    }
    return arr;
  }

  getCandidates(position: Position): Candidate[] {
    return this.candidateData.filter(candidate => candidate.position === position.id);
  }

  onSaveBallot(): void {
    this.saveBallot.emit(this.ballotForm);
  }
}


@Component({
  selector: 'app-admin-ballot-modal',
  template: ``,
  styleUrls: ['./admin-ballot-modal.component.css']
})
export class AdminBallotModalComponent implements OnInit {
  @Input() selectedElection: Election = null;
  @Input() positionsData: Position[] = [];
  @Input() candidateData: Candidate[] = [];
  @Output() newBallot: EventEmitter<BallotPOST> = new EventEmitter();
  modal: NgbModalRef;

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }

  open(): void {
    // save the modal reference so we can close it
    this.modal = this.modalService.open(AdminBallotModalContentComponent);
    // pass data to the modal inputs
    this.modal.componentInstance.selectedElection = this.selectedElection;
    this.modal.componentInstance.positionsData = this.positionsData;
    this.modal.componentInstance.candidateData = this.candidateData;
    // save the ballot when the modal save event is triggered
    this.modal.componentInstance.saveBallot.subscribe((form: any) => {
      this.onSaveBallot(form);
      // close modal and reset the form
      this.modal.close();
      // this.ballotForm.reset();
    });
  }

  onSaveBallot(form: any): void {
    // get and save results locally
    const result = Object.assign({}, form.value);
    const ballot = {
      election: null,
      position: null,
      student_id: null,
      vote: null,
    };
    // update the ballot object
    ballot.election = result.election;
    ballot.position = result.position;
    ballot.student_id = result.studentId;
    ballot.vote = result.vote;
    // emit the ballot
    this.newBallot.emit(ballot);
  }
}
