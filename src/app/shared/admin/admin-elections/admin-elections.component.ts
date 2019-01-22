import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RequestService } from 'src/shared-ng/services/services';

interface Election {
  id: string;
  election_type: string;
  start: string;
  end: string;
}


@Component({
  selector: 'app-admin-elections',
  templateUrl: './admin-elections.component.html',
  styleUrls: ['./admin-elections.component.css']
})
export class AdminElectionsComponent implements OnInit {

  @Input() data: Election[];

  constructor(private rs: RequestService) { }

  ngOnInit() {
  }

  editModal(content) {
    console.log('content', content);
  }

}


@Component({
  selector: 'app-admin-elections-modal',
  templateUrl: './admin-elections-modal.component.html',
  styleUrls: ['./admin-elections.component.css']
})
export class AdminElectionsModalComponent implements OnInit {
  @Input() name;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
