import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RequestService } from 'src/shared-ng/services/services';


interface Position {
  id: string;
  position: string;
  election_type: string;
  active: boolean; // this may need to be a string
  order: number; // this may need to be a string
}

@Component({
  selector: 'app-admin-positions',
  templateUrl: './admin-positions.component.html',
  styleUrls: ['./admin-positions.component.css']
})
export class AdminPositionsComponent implements OnInit {

  @Input() data: Position[];

  constructor(private rs: RequestService) { }

  ngOnInit() {
  }

}




@Component({
  selector: 'app-admin-positions-modal',
  templateUrl: './admin-positions-modal.component.html',
  styleUrls: ['./admin-positions.component.css']
})
export class AdminPositionsModalComponent implements OnInit {
  @Input() name;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}