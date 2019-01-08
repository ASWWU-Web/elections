import { Component, OnInit } from '@angular/core';
import { RequestService } from "../../../shared-ng/services/services"
import {Router, Routes, ActivatedRoute } from '@angular/router'


@Component({
  selector: 'aswwu-elections',
  templateUrl: './aswwu-elections.component.html',
  styleUrls: ['./aswwu-elections.component.css']
})
export class AswwuElectionsComponent implements OnInit {
  election: string;

  constructor(private requestService: RequestService, private route: ActivatedRoute, private router:Router) {
    this.requestService.get('/elections/current').subscribe((data)=>{
      this.election = data.results;
      console.log(this.election);
    },null)
   }

  ngOnInit() {
  }

}
