import { Component, OnInit, Output, Input } from '@angular/core';
import { NgbModal, NgbModalRef, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
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
  @Output() saveBallot: EventEmitter<BallotPOST> = new EventEmitter();
  @Output() closeModal: EventEmitter<null> = new EventEmitter();
  ballotForm: FormGroup;

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder) { }

  ngOnInit() {
    // set up the ballot form
    this.ballotForm = this.fb.group({
      studentID: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]{7}')])],
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
    // emit the form data
    const baseVote: BallotPOST = {
      student_id: this.ballotForm.value.studentID,
      election: this.selectedElection.id,
      position: null,
      vote: null
    };
    // cast votes for each position
    this.positionsData.forEach((position: Position, p: number) => {
      // set the position ID
      baseVote.position = position.id;
      // cast votes for each voted for candidate
      this.getCandidates(position).forEach((candidate: Candidate, c: number) => {
        // if the candidate was voted for, emit their vote
        if (this.ballotForm.value.positions[p].candidates[c].candidate) {
          // set the vote name and emit it
          baseVote.vote = candidate.username;
          this.saveBallot.emit(baseVote);
        }
      });
      // cast votes for each writein caniddate
      this.ballotForm.value.positions[p].writeins.forEach((writein: any) => {
        // set the vote name and emit it
        if (writein.writein !== null && writein.writein !== '') {
          baseVote.vote = writein.writein;
          this.saveBallot.emit(baseVote);
        }
      });
    });
    // clear the form data
    this.ballotForm.reset();
  }

  onCloseModal(): void {
    // emit a close signal for the modal
    this.closeModal.emit();
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
  @Output() saveBallot: EventEmitter<BallotPOST> = new EventEmitter();
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
    this.modal.componentInstance.saveBallot.subscribe((ballot: BallotPOST) => {
      this.saveBallot.emit(ballot);
    });
    // close the modal
    this.modal.componentInstance.closeModal.subscribe(() => {
      this.modal.close();
    });
  }
}
