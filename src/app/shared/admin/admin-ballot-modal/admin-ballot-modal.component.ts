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
  @Input() ballotForm: FormGroup;
  @Input() positionsData: Position[] = [];
  @Input() candidateData: Candidate[] = [];
  @Output() saveBallot: EventEmitter<FormGroup> = new EventEmitter();

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder) { }

  ngOnInit() {
    for (let p of this.positionsData) {
      this.addPosition(p);
    }
  }

  get positions(): FormArray {
    return this.ballotForm.get('positions') as FormArray;
  }

  addPosition(position: Position): void {
    // create list of candidates
    const candidates = this.fb.array([]);
    for (let candidate of this.getCandidates(position)) {
      candidates.push(this.fb.control(''));
    }
    // create a position form group
    const positionGroup = this.fb.group({
      candidates: candidates,
      writeIn: ['']
    });
    // add new position to the form
    this.positions.push(positionGroup);
  }

  getCandidates(position: Position): Candidate[] {
    const candidates = this.candidateData.filter(candidate => candidate.position === position.id);
    return candidates;
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
  ballotForm: FormGroup;
  modal: NgbModalRef;

  constructor(private modalService: NgbModal, private fb: FormBuilder) { }

  ngOnInit() {
    this.ballotForm = this.fb.group({
      studentID: [''],
      positions: this.fb.array([])
    });
  }

  open(): void {
    // save the modal reference so we can close it
    this.modal = this.modalService.open(AdminBallotModalContentComponent);
    // pass the form and data to the modal inputs
    this.modal.componentInstance.ballotForm = this.ballotForm;
    this.modal.componentInstance.positionsData = this.positionsData;
    this.modal.componentInstance.candidateData = this.candidateData;
    // save the ballot when the modal save event is triggered
    this.modal.componentInstance.saveBallot.subscribe((form: any) => {
      this.onSaveBallot(form);
      // close modal and reset the form
      this.modal.close();
      this.ballotForm.reset();
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
