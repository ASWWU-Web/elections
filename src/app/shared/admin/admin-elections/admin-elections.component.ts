import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbDate, NgbCalendar, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { RequestService } from 'src/shared-ng/services/services';
import { NgbTimeStructAdapter } from '@ng-bootstrap/ng-bootstrap/timepicker/ngb-time-adapter';
import { NgbTime } from '@ng-bootstrap/ng-bootstrap/timepicker/ngb-time';
import { timestamp } from 'rxjs/operators';
// import { FormGroup, FormControl } from '@angular/forms';
import { FormsModule, ReactiveFormsModule, AbstractControl, ValidatorFn } from '@angular/forms';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';

interface Election {
  id: string;
  election_type: string;
  start: string;
  end: string;
  show_results: string;
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
  data: boolean = true;

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
  rowFormGroup: FormGroup;
  candidates: Candidate[];

  constructor(private modalService: NgbModal, private rs: RequestService) { }

  ngOnInit() {
    // initialize class members
    // this.newRowData = Object.assign({}, this.rowData);
    this.candidates = [];
    this.rowFormGroup = new FormGroup({
      election_type: new FormControl(this.rowData.election_type, [Validators.required]),
      start: new FormControl(this.rowData.start, [Validators.required, this.dateValidator]),
      end: new FormControl(this.rowData.end, [Validators.required, this.dateValidator])
    });
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

  dateValidator(control: AbstractControl): {[key: string]: any} | null {
    const validRegex = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})\.(\d{1,6})$/;
    // const validRegex = /^.?$/;
    const groups: RegExpExecArray = validRegex.exec(control.value);
    let groupsArray: string[] = [];
    for (const key in groups) {
      if (groups.hasOwnProperty(key)) {
        const element = groups[key];
        groupsArray.push(element);
      }
    }
    const fullValid = validRegex.test(control.value);
    const rangeValid = Number(groupsArray[2]) <= 12
                      && Number(groupsArray[3]) <= 31
                      && Number(groupsArray[4]) <= 24
                      && Number(groupsArray[5]) <= 60
                      && Number(groupsArray[6]) <= 60;
    return rangeValid && fullValid ? null : {'invalidDate': {value: control.value}};
  }

  saveRow() {
    // Note: formData is in the same shape as what the server expects for a POST request (essentially an elections object without the id member)
    // this is not type safe, but we are doing it becuase the server will complain if an id is included in a post request
    const formData = Object.assign({}, this.rowFormGroup.value);
    const newElection: boolean = this.rowData.id.length === 0;
    let saveObservable: Observable<any>;

    if (newElection) {
      formData['show_results'] = null;
      console.log(formData);
      saveObservable = this.rs.post('elections/election', formData);
    } else {
      formData['id'] = this.rowData.id;
      formData['show_results'] = null;
      saveObservable = this.rs.put('elections/election/' + this.rowData.id, formData);
    }
    saveObservable.subscribe(
      (data) => {
        this.rowData = Object.assign({}, data);
        this.rowFormGroup.markAsPristine();
      }, (err) => {
      });
  }

  openCandidatesModal() {
    const electionID = this.rowData.id;
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

  addElection() {
    const newElection: Election = {
      id: '',
      election_type: '',
      start: '',
      end: '',
      show_results: null,
    };
    this.data.push(newElection);
  }
}
