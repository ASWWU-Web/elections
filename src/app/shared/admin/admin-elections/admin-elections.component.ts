import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { RequestService } from 'src/shared-ng/services/services';

interface Election {
  id: string;
  election_type: string;
  start: string;
  end: string;
}


@Component({
  selector: 'app-admin-elections-modal',
  templateUrl: './admin-elections-modal.component.html',
  styleUrls: ['./admin-elections.component.css']
})
export class AdminElectionsModalComponent implements OnInit {
  data: Election;
  radioModel: string;
  model;
  modelInput;

// ------- data picker copy ---------
  hoveredDate: NgbDate;
  startDate: NgbDate;
  endDate: NgbDate;

  // constructor(calendar: NgbCalendar) {
  //   this.startDate = calendar.getToday();
  //   this.endDate = calendar.getNext(calendar.getToday(), 'd', 10);
  // }

  onDateSelection(date: NgbDate) {
    if (!this.data.start && !this.data.end) {
      this.startDate = date; // stopped here, need to convert ngbdate to string
    } else if (this.startDate && !this.endDate && date.after(this.startDate)) {
      this.endDate = date;
    } else {
      this.endDate = null;
      this.startDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.startDate && !this.endDate && this.hoveredDate && date.after(this.startDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return date.after(this.startDate) && date.before(this.endDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.startDate) || date.equals(this.endDate) || this.isInside(date) || this.isHovered(date);
  }

  dateTimeStringToNgbDate(date: string) {
    const newDate = {
      year: Number(date.slice(0, 4)),
      month: Number(date.slice(5, 7)),
      day: Number(date.slice(8, 10))
    };
    return new NgbDate(newDate.year, newDate.month, newDate.day);
  }

  dateTimeStringToNgbTimeStruct(date: string) {
    const newTime = {
      hour: Number(date.slice(11, 13)),
      minute: Number(date.slice(14, 16)),
      second: Number(date.slice(17, 19))
    };
    return new NgbDate(newTime.hour, newTime.minute, newTime.second);
  }



  constructor(public activeModal: NgbActiveModal, calendar: NgbCalendar) {
  }

  ngOnInit() {
    this.startDate = this.dateTimeStringToNgbDate(this.data.start);
    this.endDate = this.dateTimeStringToNgbDate(this.data.end);
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

  editModal(data: Election) {
    // console.log('content', content);
    const modalRef = this.modalService.open(AdminElectionsModalComponent);
    modalRef.componentInstance.data = data;
  }
}
