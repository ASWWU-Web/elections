import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RequestService } from 'src/shared-ng/services/services';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';


interface Position {
  id: string;
  position: string;
  election_type: string;
  active: boolean; // this may need to be a string
  order: string;
}

@Component({
  selector: '[positions-row]',
  templateUrl: './admin-positions-row.component.html',
  styleUrls: ['./admin-positions.component.css']
})
export class AdminPositionsRowComponent implements OnInit {

  @Input() rowData: Position;
  rowFormGroup: FormGroup;
  positions: Position[];

  constructor(private modalService: NgbModal, private rs: RequestService) { }

  ngOnInit() {
    // initialize class members
    // this.newRowData = Object.assign({}, this.rowData);
    this.positions = [];
    this.rowFormGroup = new FormGroup({
      election_type: new FormControl(this.rowData.election_type, [Validators.required]),
      position: new FormControl(this.rowData.position, [Validators.required]),
      active: new FormControl(this.rowData.active, [Validators.required]),
      order: new FormControl(this.rowData.order, [Validators.required])
    });
  }

  saveRow() {
    // Note: formData is in the same shape as what the server expects for a POST request (essentially an elections object without the id member)
    // this is not type safe, but we are doing it becuase the server will complain if an id is included in a post request
    const formData = Object.assign({}, this.rowFormGroup.value);
    const newPosition: boolean = this.rowData.id.length === 0;
    let saveObservable: Observable<any>;

    if (newPosition) {
      formData['show_results'] = null;
      console.log(formData);
      saveObservable = this.rs.post('elections/position', formData);
    } else {
      formData['id'] = this.rowData.id;
      formData['show_results'] = null;
      saveObservable = this.rs.put('elections/position/' + this.rowData.id, formData);
    }
    saveObservable.subscribe(
      (data) => {
        this.rowData = Object.assign({}, data);
        this.rowFormGroup.markAsPristine();
      }, (err) => {
      });
  }
}

@Component({
  selector: 'app-admin-positions',
  templateUrl: './admin-positions.component.html',
  styleUrls: ['./admin-positions.component.css']
})
export class AdminPositionsComponent implements OnInit {
  @Input() data: Position[];

  constructor(private rs: RequestService) { }

  ngOnInit() { }

  addPosition() {
    const newElection: Position = {
      id: '',
      election_type: '',
      position: '',
      active: true,
      order: '',
    };
    this.data.push(newElection);
  }
}
