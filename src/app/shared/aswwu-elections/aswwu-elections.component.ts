import { Component, OnInit } from '@angular/core';
import { RequestService } from "../../../shared-ng/services/services"
import {Router, Routes, ActivatedRoute } from '@angular/router'
import { CURRENT_YEAR, MEDIA_SM } from '../../../shared-ng/config';


@Component({
  selector: 'aswwu-elections',
  templateUrl: './aswwu-elections.component.html',
  styleUrls: ['./aswwu-elections.component.css']
})
export class AswwuElectionsComponent implements OnInit {
  election: any;
  positions: any[] = [];
  pageNumber: number = 0;
  districts: string[][] = [
    ["1",  "Sittner 1 & 2 Floor, Meske"],
    ["2",  "Sittner 3 & 4 Floor"], 
    ["3",  "Conard"], 
    ["4",  "Forman"],
    ["5",  "Mountain View, Birch Apartments"],
    ["6",  "Hallmark, Faculty, Univeristy-Owned Housing"],
    ["7",  "Off-Campus"],
    ["8",  "Portland"],
    ["9",  "Faculty"],
    ["10", "Staff"]
  ];

  // selectedDistrict: string = "";
  districtModel: string = ""
  candidates: any[] = [];
  candidateModel: any = {};
  writeInModel = {
    writeIn1: "",
    writeIn2: ""
  };

  submissionSuccess = null;

  constructor(private requestService: RequestService, private route: ActivatedRoute, private router:Router) {
    // get current election
    this.requestService.get('/elections/current').subscribe((data) => {
      this.election = data;
      // get all aswwu positions
      this.requestService.get('/elections/position', {election_type: "aswwu", active: true}).subscribe((data) => {
        this.positions = data.positions;
      }, null);
    }, null);
    }

  ngOnInit() {
  }

  buildCandidateModel() {
    for (let candidate of this.candidates) {
      this.candidateModel[candidate.username] = false;
    }
  }

  addCandidatePhoto(username, i){
    let uri = '/profile/' + CURRENT_YEAR + '/' + username;
    this.requestService.get(uri).subscribe((data) => {
      let photoURI = MEDIA_SM + '/'
      if (data.photo != "None") {
        photoURI =  photoURI + data.photo;
      }
      else {
        photoURI = photoURI + 'images/default_mask/default.jpg';
      }
      this.candidates[i].photo = photoURI;
    }, (data) => {})
  }

  getCandidates(position_id) {
    // delete past candidates
    this.candidateModel = {};

    // get next set of candidates
    this.requestService.get(('elections/election/' + this.election.id) + '/candidate', {position: position_id}).subscribe((data) => {
      this.candidates = data.candidates;
      console.log("GET");
      console.log(data.candidates);
      let i = 0;
      for (let candidate of this.candidates) {
        this.addCandidatePhoto(candidate.username, i);
        i = i + 1;
      }
      this.buildCandidateModel();
    }, (data) => {})
  }

  submitVote(position_id) {
    // submite vote
    let requestBody = {
      election: this.election.id,
      position: position_id,
      vote: null
    }
    // determine who was voted for
    for (let candidate in this.candidateModel) {
      if (this.candidateModel[candidate] == true) {
        requestBody.vote = candidate;
        break;
      }
    }
    // submit vote
    let postURI = 'elections/vote';
    console.log("POST");
    console.log(requestBody);
    this.requestService.post(postURI, requestBody).subscribe((data) => {
      this.submissionSuccess = true;
    }, (error) => {
      this.submissionSuccess = false
    });
  }

  nextPage() {
    this.pageNumber++;
    window.scrollTo(0,0);
  }

  startOver() {
    // hide pages
    this.pageNumber=null;
    //reset models
    this.districtModel = "";
    this.candidateModel = {};
    this.writeInModel.writeIn1 = "";
    this.writeInModel.writeIn2 = "";
    this.submissionSuccess = null;
    // go to first page (district selection)
    this.pageNumber = 0;
    window.scrollTo(0,0);
  }


  valueChange($event, username){
    this.candidateModel[username] = $event;
  }

  enableVoting(name, isCandidate) {
    let numSelected = 0;
    for (let candidate in this.candidateModel) {
      if (this.candidateModel[candidate] == true) {
        numSelected = numSelected + 1;
      }
    }
    if (this.writeInModel.writeIn1.length > 0) {
      numSelected = numSelected + 1;
    }
    if (this.writeInModel.writeIn2.length > 0) {
      numSelected = numSelected + 1;
    }
    if (numSelected >= 2) {
      if (isCandidate) {
        return this.candidateModel[name];
      } else {
        return (name.length > 0);
      }
    } else {
      return true;
    }
  }
}
