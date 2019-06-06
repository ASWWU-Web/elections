// angular generated imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';

// aswwu  non-component imports
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


// shared-ng components
import {
  AppComponent
} from './app.component';
import {
  SharedNgContainerComponent,
  FooterComponent,
  NavBarComponent,
  UserBubbleComponent,
  HeaderComponent
} from '../shared-ng/components/components';
import {
  RequestService,
  HermesService,
  ElectionsRequestService
} from '../shared-ng/services/services';

// project components
import {
  HomeComponent,
  VoteComponent,
  AdminComponent
} from './routes/routes';
import {
  CountdownComponent,
  AdminElectionsComponent,
  AdminElectionsCandidateModalComponent,
  AdminCandidatesRowComponent,
  AdminElectionsRowComponent,
  AdminPositionsComponent,
  AdminPositionsRowComponent,
  AdminBallotsComponent,
  VoteFormComponent,
  MultiPositionHandlerComponent,
  DistrictSelectionComponent,
  NavigatorComponent,
  AdminBallotModalComponent,
  AdminBallotModalContentComponent
} from './shared/shared';


@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    UserBubbleComponent,
    FooterComponent,
    SharedNgContainerComponent,
    HomeComponent,
    HeaderComponent,
    CountdownComponent,
    VoteComponent,
    AdminComponent,
    AdminElectionsComponent,
    AdminElectionsCandidateModalComponent,
    AdminCandidatesRowComponent,
    AdminElectionsRowComponent,
    AdminPositionsComponent,
    AdminPositionsRowComponent,
    VoteFormComponent,
    MultiPositionHandlerComponent,
    DistrictSelectionComponent,
    NavigatorComponent,
    AdminBallotsComponent,
    AdminBallotModalComponent,
    AdminBallotModalContentComponent,
    SharedNgContainerComponent
  ],
  imports: [
    NgbModule,
    BrowserModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    AppRoutingModule,
  ],
  providers: [
    RequestService,
    HermesService,
    ElectionsRequestService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    AdminElectionsCandidateModalComponent,
    AdminElectionsRowComponent,
    AdminPositionsRowComponent,
    AdminBallotModalContentComponent
  ]
})
export class AppModule { }
