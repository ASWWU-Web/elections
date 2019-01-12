import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../../shared-ng/services/request.service';
import { CURRENT_YEAR, MEDIA_SM } from '../../../shared-ng/config';
//import { disconnect } from 'cluster';

@Component({
  selector: 'senate-elections',
  templateUrl: './senate-elections.component.html',
  styleUrls: ['./senate-elections.component.css']
})
export class SenateElectionsComponent implements OnInit {
  
  // TODO:
  //    on initialization get list of candidates (alternatively wait until "Go" and have server only return candidates for one district)
  //    Show the first page with district
  //    bind variable to district choice
  //    Go button that sets show candidates to true
  //    Set districts html to show only when show-candidates is false
  //    Set candidates html to show only when show-candidates is true and candidate list exists
  //    on "Go" build district-candidate list based on selected district
  //      fetch display names and images for district candidate list if we decide not to included 
  //        them in original candidate list
  //    use ngfor on district-candidate list
  //    use ngstyle to set unselected pictures to faded state when number of selected pictures + input boxes fillled >= 2
  //    set empty write-in inputs to inactive (grayed out) state when number of selected pictures + input boxes fillled >=2
  //
  //    add a clear button to candidate selection page
  //
  
  constructor(private rs: RequestService) { }
  
  // Page 0 is districts page
  pageNumber: number = 0;
  
  //candidatesJSON = {};
  candidatesJSON = [
      {
        "id": "0c3fa8c5-d580-4c47-8598-a4bfd7657711",
        "election": "e7c5c84f-0a58-4f3b-8490-14ee0737d96f",
        "position": "7c336bd7-7e21-4a81-a4c2-bc076852611c",
        "username": "sheldon.woodward",
        "display_name": "Sheldon Woodward",
        "photo": "https://aswwu.com/media/img-md/profiles/1819/02523-2029909.jpg"
      },
      {
        "id": "0c3fa8c5-d580-4c47-8598-a4bfd7657711",
        "election": "e7c5c84f-0a58-4f3b-8490-14ee0737d96f",
        "position": "7c336bd7-7e21-4a81-a4c2-bc076852611c",
        "username": "sheldon.woodward",
        "display_name": "Sheldon Woodward",
        "photo": "https://aswwu.com/media/img-md/profiles/1819/02523-2029909.jpg"
      },
      {
        "id": "0c3fa8c5-d580-4c47-8598-a4bfd7657711",
        "election": "e7c5c84f-0a58-4f3b-8490-14ee0737d96f",
        "position": "7c336bd7-7e21-4a81-a4c2-bc076852611c",
        "username": "sheldon.woodward",
        "display_name": "Sheldon Woodward",
        "photo": "https://aswwu.com/media/img-md/profiles/1819/02523-2029909.jpg"
      },
    ];
  
  // districts: string[][] = [
  //   ["1",  "Sittner 1 & 2 Floor, Meske"],
  //   ["2",  "Sittner 3 & 4 Floor"], 
  //   ["3",  "Conard"], 
  //   ["4",  "Forman"],
  //   ["5",  "Mountain View, Birch Apartments"],
  //   ["6",  "Hallmark, Faculty, Univeristy-Owned Housing"],
  //   ["7",  "Off-Campus"],
  //   ["8",  "Portland"],
  //   ["9",  "Faculty"],
  //   ["10", "Staff"]
  // ];
  
  // current election object
  // {
  //   "id": "e7c5c84f-0a58-4f3b-8490-14ee0737d96f",
  //   "election_type": "aswwu",
  //   "start": "2018-11-05 08:00:00.000000",
  //   "end": "2018-11-05 20:00:00.000000"
  // }
  election: any;
  // Dictionary where the key is the position id and the value is a singular position object as returned from the server
  positions: any;

  // districtModel is the selected district
  districtModel: string = null;
  // candidates is an array of the candidates running for the position 
  // [
  //   {
  //     "id": "0c3fa8c5-d580-4c47-8598-a4bfd7657711",
  //     "election": "e7c5c84f-0a58-4f3b-8490-14ee0737d96f",
  //     "position": "7c336bd7-7e21-4a81-a4c2-bc076852611c",
  //     "username": "sheldon.woodward",
  //     "display_name": "Sheldon Woodward",
  //     "photo": "https://aswwu.com/media/img-md/profiles/1819/02523-2029909.jpg"
  //   }
  // ]
  candidates: any[] = [];
  // candidateModel is a dictionary with the username of the candidate as the key, and a boolean indicating whether that candidate is selected as the value
  candidateModel: any = {};
  // Handles write-in votes
  writeInModel = {
    writeIn1: "",
    writeIn2: ""
  };
  objectKeys = Object.keys;

  submissionSuccess = null;

  ngOnInit() {
    this.getElection();
    this.getPositions();
  }

  buildCandidateModel() {
    for (let candidate of this.candidates) {
      this.candidateModel[candidate.username] = false;
    }
  }

  addCandidatePhoto(username, i){
    let uri = '/profile/' + CURRENT_YEAR + '/' + username;
    this.rs.get(uri).subscribe((data) => {
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

  getElection() {
    this.rs.get('elections/current').subscribe((data) => {
      if (data.election_type != "senate") {
        console.error("This election is not a Senate election")
        return;
      }
      this.election = data;
    }, (data) => {})
  }

  getPositions() {
    this.positions = {};
    this.rs.get('elections/position', {election_type: "senate", active: true}).subscribe((data) => {
      for (let position in data.positions) {
        this.positions[position['id']] = position;
      }
    }, (data) => {})
  }

  getCandidates() {
    if (!this.districtModel) {
      return;
    }
    
    this.rs.get('elections/election/' + this.election.id + '/candidate', {position: this.positions[this.districtModel]}).subscribe((data) => {
      this.candidates = data.candidates;
      console.log("data", data);
      let i = 0;
      for (let candidate of this.candidates) {
        this.addCandidatePhoto(candidate.username, i);
        i = i + 1;
      }
      this.buildCandidateModel();
    }, (data) => {console.log("error", data)})

    // Page 1 is the candidates page
    this.pageNumber = 1;
    window.scrollTo(0,0);
  }

  getVote() {
    this.rs.get('elections/vote').subscribe((data) => {
      this.districtModel = data[0]['position'];
      for (let vote in data) {
        if (this.candidateModel.hasOwnProperty(vote['vote'])) {
          this.candidateModel[vote['vote']] = true;
        } else {
          if (this.writeInModel.writeIn1 != "") {
            this.writeInModel.writeIn1 = vote['vote'];
          } else {
            this.writeInModel.writeIn2 = vote['vote'];
          }
        }
      }
    }, (error)=>{});
  }

  submit() {
    let postURI = 'elections/vote';
    let response = this.buildJsonResponse(this.election.id, this.positions[this.districtModel].id);
    this.rs.post(postURI, response[0]).subscribe(
      (data)=>{
        console.log("First post", data);
        this.rs.post(postURI, response[1]).subscribe(
          (data)=>{
            console.log("Second post", data);
            this.submissionSuccess = true;
          }, 
          (data)=>{
            console.log("Second post fail", data);
            this.submissionSuccess = false
          });
      }, 
      (data)=>{
        console.log("First post fail", data);
        this.submissionSuccess = false
      });
  
    // Page 2 is the submission page
    this.pageNumber = 2;
    window.scrollTo(0,0);
  }

  startOver() {
    // hide pages
    this.pageNumber=null;
    //reset models
    this.districtModel = null;
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

  buildJsonResponse(election: string, position: string) {
    let response = {
      vote_1: null,
      vote_2: null,
      write_in_1: null,
      write_in_2: null
    };
    let tempResponse: any[] = [];
    console.log("candidate model", this.candidateModel);
    for (let candidate in this.candidateModel) {
      if (this.candidateModel[candidate] == true) {
        if (!response.vote_1) {
          response.vote_1 = candidate;
        } else if (!response.vote_2) {
          response.vote_2 = candidate;
        } else {
          // something went wrong...
        }
      }
    }
    if (this.writeInModel.writeIn1.length > 0) {
      response.write_in_1 = this.writeInModel.writeIn1;
    }
    if (this.writeInModel.writeIn2.length > 0) {
      response.write_in_2 = this.writeInModel.writeIn2;
    }
    for (let vote in response) {
      if (response[vote]) {
        let tempVote = {
          election: election,
          position: position, 
          vote: response[vote]
        }
        tempResponse.push(tempVote);
      }
    }
    console.log("temp response", tempResponse)
    return tempResponse;
  }
}
