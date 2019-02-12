import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbDate, NgbCalendar, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { RequestService } from 'src/shared-ng/services/services';
import { positionElements } from '@ng-bootstrap/ng-bootstrap/util/positioning';


interface Candidate {
    id: string;
    election: string;
    position: string;
    username: string;
    display_name: string;
  }

  interface Position {
    id: string;
    position: string;
    election_type: string;
    active: boolean; // this may need to be a string
    order: number; // this may need to be a string
  }

@Component({
    selector: 'app-admin-elections-candidate-modal',
    templateUrl: './admin-elections-candidate-modal.component.html',
    styleUrls: ['./admin-elections-candidate.component.css']
  })
  export class AdminElectionsCandidateModalComponent implements OnInit {
    @Input() candidates: Candidate[];
    @Input() positions: Position[];
    @Input() electionID: string;
  
    constructor(public activeModal: NgbActiveModal) {}
  
    ngOnInit() {}

    addCandidate() {
        const empty_candidate: Candidate = {
            id: '',
            election: '',
            position: '',
            username: '',
            display_name: ''
        };
        this.candidates.push(empty_candidate);
        console.log("Add empty candidate");
    }
}

@Component({
    selector: '[admin-candidates-row]',
    templateUrl: './admin-elections-candidate-row.component.html',
    styleUrls: ['./admin-elections-candidate.component.css']
  })
  export class AdminCandidatesRowComponent implements OnInit {
    @Input() rowData: Candidate;
    @Input() electionID: string;
    @Input() positions: Position[];
    rowFormGroup: FormGroup;
      
    constructor(public activeModal: NgbActiveModal, private rs: RequestService) {
    }
  
    ngOnInit() {
        this.rowFormGroup = new FormGroup({
            election: new FormControl(this.rowData.election, [Validators.required]),
            position: new FormControl(this.rowData.position, [Validators.required]),
            username: new FormControl(this.rowData.username, [Validators.required]),
            display_name: new FormControl(this.rowData.display_name, [Validators.required])
        });
    }

    saveRow() {
        // Note: formData is in the same shape as what the server expects for a POST request (essentially an elections object without the id member)
        // this is not type safe, but we are doing it becuase the server will complain if an id is included in a post request
        let formData = Object.assign({}, this.rowFormGroup.value);
        const newCandidate: boolean = this.rowData.id.length === 0;
        let saveObservable: Observable<any>;

        if (newCandidate) {
            saveObservable = this.rs.post('elections/' + this.electionID + '/candidate', formData);
        } else {
            formData['id'] = this.rowData.id;
            saveObservable = this.rs.put('elections/' + this.electionID + '/candidate/' + this.rowData.id, formData)
        }
        saveObservable.subscribe(
            (data) => {
            this.rowData = Object.assign({}, data);
            this.rowFormGroup.markAsPristine();
            }, (err) => {
        });
    }
}