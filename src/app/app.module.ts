// angular generated imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';

// aswwu  non-component imports
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


// shared-ng components
import {
  AppComponent
} from '../shared-ng/components/app/app.component';
import { 
  FooterComponent, 
  NavBarComponent, 
  MobileNavComponent, 
  UserBubbleComponent, 
  HeaderComponent
} from '../shared-ng/components/components';
import {
  RequestService
} from '../shared-ng/services/services';

// project components
import {
  HomeComponent,
  VoteComponent,
  AdminComponent
} from './routes/routes';
import {
  CountdownComponent,
  AswwuElectionsComponent,
  SenateElectionsComponent,
  AdminElectionsComponent,
  AdminElectionsCandidateModalComponent,
  AdminElectionsRowComponent,
  AdminPositionsComponent,
  AdminPositionsRowComponent
} from './shared/shared';
import { VoteFormComponent } from './shared/vote-form/vote-form.component';
import { MultiPositionHandlerComponent } from './shared/multi-position-handler/multi-position-handler.component';
import { DistrictSelectionComponent } from './shared/district-selection/district-selection.component';


@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    UserBubbleComponent,
    MobileNavComponent,
    FooterComponent,
    HomeComponent,
    HeaderComponent,
    CountdownComponent,
    VoteComponent,
    SenateElectionsComponent,
    AdminComponent,
    AdminElectionsComponent,
    AdminElectionsCandidateModalComponent,
    AdminElectionsRowComponent,
    AdminPositionsComponent,
    AdminPositionsRowComponent,
    AswwuElectionsComponent,
    SenateElectionsComponent,
    VoteFormComponent,
    MultiPositionHandlerComponent,
    DistrictSelectionComponent
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
    RequestService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    AdminElectionsCandidateModalComponent,
    AdminElectionsRowComponent,
    AdminPositionsRowComponent,
  ]
})
export class AppModule { }
