import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbDate, NgbCalendar, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { RequestService } from 'src/shared-ng/services/services';
import { NgbTimeStructAdapter } from '@ng-bootstrap/ng-bootstrap/timepicker/ngb-time-adapter';
import { NgbTime } from '@ng-bootstrap/ng-bootstrap/timepicker/ngb-time';
import { timestamp } from 'rxjs/operators';

interface Election {
  id: string;
  election_type: string;
  start: string;
  end: string;
}


interface Candidate {
  id: string;
  election: string;
  position: string;
  username: string;
  display_name: string;
}


@Component({
  selector: 'app-admin-elections-candidate-modal',
  templateUrl: './admin-elections-candidate-modal.component.html',
  styleUrls: ['./admin-elections.component.css']
})
export class AdminElectionsCandidateModalComponent implements OnInit {
  electionID: string;

  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit() {}
}



@Component({
  selector: '[elections-row]',
  templateUrl: './admin-elections-row.component.html',
  styleUrls: ['./admin-elections.component.css']
})
export class AdminElectionsRowComponent implements OnInit {

  @Input() rowData: Election;
  newRowData: Election;
  candidates: Candidate[];
  electionSaved: boolean;
  electionsEqual: boolean;

  constructor(private modalService: NgbModal, private rs: RequestService) { }

  ngOnInit() {
    // initialize class members
    this.electionSaved = true;
    this.electionsEqual = true;
    this.newRowData = Object.assign({}, this.rowData);
    this.candidates = [];
    // get candidates for this row
    const candidatesObservable = this.rs.get('elections/election/' + this.rowData.id + '/candidate');
    candidatesObservable.subscribe(
      (data: {candidates: Candidate[]}) => {
        this.candidates = data.candidates;
      },
      (err) => {
        console.log('unable to get candidates');
      });
  }


  saveRow() {
    const saveObservable = this.rs.put('elections/election/' + this.newRowData.id, this.newRowData);
    saveObservable.subscribe(
      (data) => {
        this.electionSaved = true;
        this.rowData = Object.assign({}, this.newRowData);
        this.electionsEqual = this.compareElections();
      }, (err) => {
        this.electionSaved = false;
      });
  }


  compareElectionsDelayed() {



    const e1 = this.rowData;
    const e2 = this.newRowData;
    const electionsEqual = e1.id === e2.id
                            && e1.election_type === e2.election_type
                            && e1.start === e2.start
                            && e1.end === e2.end;
    console.log(Date.now(), 'e1:', e1, 'e2:', e2);
    this.electionsEqual = electionsEqual;
    if (!electionsEqual) {
      this.electionSaved = false;
    }
    return electionsEqual;
  }


  openCandidatesModal(electionID: string) {
    const modalRef = this.modalService.open(AdminElectionsCandidateModalComponent);
    modalRef.componentInstance.electionID = electionID;
  }
}



@Component({
  selector: 'app-admin-elections',
  templateUrl: './admin-elections.component.html',
  styleUrls: ['./admin-elections.component.css']
})
export class AdminElectionsComponent implements OnInit {

  @Input() data: Election[];

  constructor(private rs: RequestService, private modalService: NgbModal) { }

  ngOnInit() {
  }
}
