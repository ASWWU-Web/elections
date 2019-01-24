import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbDate, NgbCalendar, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { RequestService } from 'src/shared-ng/services/services';
import { NgbTimeStructAdapter } from '@ng-bootstrap/ng-bootstrap/timepicker/ngb-time-adapter';
import { NgbTime } from '@ng-bootstrap/ng-bootstrap/timepicker/ngb-time';

interface Election {
  id: string;
  election_type: string;
  start: string;
  end: string;
}

interface ElectionTableItem {
  id: string;
  election_type: string;
  startDate: NgbDate;
  startTime: NgbTimeStruct;
  endDate: NgbDate;
  endTime: NgbTimeStruct;
}

interface Candidate {
  id: string;
  election: string;
  position: string;
  username: string;
  display_name: string;
}


@Component({
  selector: 'app-admin-elections-modal',
  templateUrl: './admin-elections-modal.component.html',
  styleUrls: ['./admin-elections.component.css']
})
export class AdminElectionsModalComponent implements OnInit {
  data: Election;
  radioModel: string;
  hoveredDate: NgbDate;
  startDate: NgbDate;
  endDate: NgbDate;

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

  constructor() { }

  ngOnInit() {
  }
}



@Component({
  selector: 'app-admin-elections',
  templateUrl: './admin-elections.component.html',
  styleUrls: ['./admin-elections.component.css']
})
export class AdminElectionsComponent implements OnInit {

  @Input() data: Election[];
  tableModel: ElectionTableItem[];

  constructor(private rs: RequestService, private modalService: NgbModal) { }

  ngOnInit() {
  }
}
