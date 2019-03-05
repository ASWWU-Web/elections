import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { ElectionsRequestService } from 'src/shared-ng/services/services';
import { debounceTime, distinctUntilChanged, map, switchMap} from 'rxjs/operators';
import { of } from 'rxjs';
import { Candidate, Position } from 'src/shared-ng/interfaces/elections';


@Component({
  selector: 'app-admin-elections-candidate-modal',
  templateUrl: './admin-elections-candidate-modal.component.html',
  styleUrls: ['./admin-elections-candidate.component.css']
})
export class AdminElectionsCandidateModalComponent implements OnInit {
  @Input() electionID: string;
  @Input() election_type: string;
  @Input() candidates: Candidate[];
  @Input() positions: Position[];

  constructor(public activeModal: NgbActiveModal, private ers: ElectionsRequestService) {}

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
  }

  // deletes candidate from database and removes row in modal
  removeCandidate(candidate_id: string) {
    let removeObservable: Observable<any>;
    removeObservable = this.ers.delete('elections/election/' + this.electionID + '/candidate/' + candidate_id);

    // confirmation with user
    const userConfirm = confirm('Warning! This action is permanent.');
    if (userConfirm) {
      removeObservable.subscribe(() => {
          // get specific index of row that user wants to delete
          const index = this.candidates.findIndex(candidate => candidate.id === candidate_id );
          this.candidates.splice(index, 1);
        }, () => {
          alert('Something went wrong 😢');
        }
      );
    }
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
  @Input() election_type: string;
  @Input() positions: Position[];
  @Output() remove: EventEmitter<string> = new EventEmitter();
  rowFormGroup: FormGroup;

  constructor(public activeModal: NgbActiveModal, private ers: ElectionsRequestService) {
  }

  ngOnInit() {
    const arr: Position[] = [];
    for (const position of this.positions) {
      if (position.election_type === this.election_type) {
        arr.push(position);
      }
    }
    this.positions = arr;
      this.rowFormGroup = new FormGroup({
          position: new FormControl(this.rowData.position, [Validators.required]),
          username: new FormControl(this.rowData.username, [Validators.required]),
          display_name: new FormControl(this.rowData.display_name, [Validators.required])
      });
  }

  getNames(query: string) {
    if (query === '') {
      return of({results: []});
    }
    return this.ers.get('search/names', {'full_name': query});
  }

  search = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(data => this.getNames(data)),
      map((data: {results: {username: string, full_name: string}[]}) => {
        return data.results.map((item) => item.username);
      })
    );
  }

  saveRow() {
      // Note: formData is in the same shape as what the server expects for a POST request (essentially an elections object without the id member)
      // this is not type safe, but we are doing it becuase the server will complain if an id is included in a post request
      const formData = Object.assign({}, this.rowFormGroup.value);
      const newCandidate: boolean = this.rowData.id.length === 0;
      let saveObservable: Observable<any>;

      if (newCandidate) {
          saveObservable = this.ers.post('elections/election/' + this.electionID + '/candidate', formData);
      } else {
        formData['election'] = this.electionID;
        formData['id'] = this.rowData.id;
        saveObservable = this.ers.put('elections/election/' + this.electionID + '/candidate/' + this.rowData.id, formData);
      }
      saveObservable.subscribe(
          (data) => {
          this.rowData = Object.assign({}, data);
          this.rowFormGroup.markAsPristine();
          }, (err) => {
      });

  }

  // Deletes Candidate
  deleteRow() {
    // calls parent class while emitting row id for indexing
    this.remove.emit(this.rowData.id);
  }
}
