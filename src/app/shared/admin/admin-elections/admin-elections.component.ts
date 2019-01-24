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

  constructor(public activeModal: NgbActiveModal, calendar: NgbCalendar) {
  }

  ngOnInit() {
    this.startDate = this.dateTimeStringToNgbDate(this.data.start);
    this.endDate = this.dateTimeStringToNgbDate(this.data.end);
  }


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
}



@Component({
  selector: '[elections-row]',
  templateUrl: './admin-elections-row.component.html',
  styleUrls: ['./admin-elections.component.css']
})
export class AdminElectionsRowComponent implements OnInit {

  @Input() rowData: Election;

  // constructor() { }

  // ngOnInit(): void {
  //   // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  //   // Add 'implements OnInit' to the class.
  // }
  radioModel: string;
  hoveredDate: NgbDate;
  startDate: NgbDate;
  endDate: NgbDate;

  constructor(calendar: NgbCalendar) {
  }

  ngOnInit() {
    this.startDate = this.dateTimeStringToNgbDate(this.rowData.start);
    this.endDate = this.dateTimeStringToNgbDate(this.rowData.end);
  }


  onDateSelection(date: NgbDate) {
    if (!this.rowData.start && !this.rowData.end) {
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

  // editModal(data: Election) {
  //   // console.log('content', content);
  //   const modalRef = this.modalService.open(AdminElectionsModalComponent);
  //   modalRef.componentInstance.data = data;
  // }


  // ------ coppied from modal ------

  // radioModel: string;
  // hoveredDate: NgbDate;
  // startDate: NgbDate;
  // endDate: NgbDate;

  // constructor(public activeModal: NgbActiveModal, calendar: NgbCalendar, private rs: RequestService, private modalService: NgbModal) {
  // }

  // ngOnInit() {
  //   this.tableModel = this.data.map((item: Election) => {
  //     const newTableItem: ElectionTableItem = {
  //       id: item.id,
  //       election_type: item.election_type,
  //       startDate: this.dateTimeStringToNgbDate(item.start),
  //       startTime: this.dateTimeStringToNgbTimeStruct(item.start),
  //       endDate: this.dateTimeStringToNgbDate(item.end),
  //       endTime: this.dateTimeStringToNgbTimeStruct(item.end)
  //     };
  //     return newTableItem;
  //   });
  //   // this.startDate = this.dateTimeStringToNgbDate(this.data.start);
  //   // this.endDate = this.dateTimeStringToNgbDate(this.data.end);
  // }


  // onDateSelection(date: NgbDate) {
  //   if (!this.data.start && !this.data.end) {
  //     this.startDate = date; // stopped here, need to convert ngbdate to string
  //   } else if (this.startDate && !this.endDate && date.after(this.startDate)) {
  //     this.endDate = date;
  //   } else {
  //     this.endDate = null;
  //     this.startDate = date;
  //   }
  // }


  // isHovered(date: NgbDate) {
  //   return this.startDate && !this.endDate && this.hoveredDate && date.after(this.startDate) && date.before(this.hoveredDate);
  // }


  // isInside(date: NgbDate) {
  //   return date.after(this.startDate) && date.before(this.endDate);
  // }


  // isRange(date: NgbDate) {
  //   return date.equals(this.startDate) || date.equals(this.endDate) || this.isInside(date) || this.isHovered(date);
  // }


  // dateTimeStringToNgbDate(date: string) {
  //   const newDate = {
  //     year: Number(date.slice(0, 4)),
  //     month: Number(date.slice(5, 7)),
  //     day: Number(date.slice(8, 10))
  //   };
  //   return new NgbDate(newDate.year, newDate.month, newDate.day);
  // }


  // dateTimeStringToNgbTimeStruct(date: string) {
  //   // NgbTimeStruct is an interface, as opposed to NgbDate which is a class
  //   const newTime: NgbTimeStruct = {
  //     hour: Number(date.slice(11, 13)),
  //     minute: Number(date.slice(14, 16)),
  //     second: Number(date.slice(17, 19))
  //   };
  //   return newTime;
  // }
}
