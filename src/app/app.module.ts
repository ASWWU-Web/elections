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
import { AppComponent } from '../shared-ng/components/app/app.component';
import { FooterComponent, NavBarComponent, MobileNavComponent, UserBubbleComponent} from '../shared-ng/components/components';
import { RequestService } from '../shared-ng/services/services';

// project components
import {
  HomeComponent,
  VoteComponent,
  AdminComponent
} from './routes/routes';
import {
  HeaderComponent,
  CountdownComponent,
  AswwuElectionsComponent,
  SenateElectionsComponent,
  AdminElectionsComponent,
  AdminElectionsCandidateModalComponent,
  AdminCandidatesRowComponent,
  AdminElectionsRowComponent,
  AdminPositionsComponent,
  AdminPositionsModalComponent
} from './shared/shared';


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
    AdminCandidatesRowComponent,
    AdminElectionsRowComponent,
    AdminPositionsComponent,
    AdminPositionsModalComponent,
    AswwuElectionsComponent,
    SenateElectionsComponent
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
    RouterModule.forRoot([
      {
        'path': 'vote',
        component: VoteComponent
      },
      {
        'path': 'admin',
        component: AdminComponent
      },
      {
        'path': '',
        component: HomeComponent
      }
    ])

  ],
  providers: [
    RequestService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    AdminElectionsCandidateModalComponent,
    AdminElectionsRowComponent,
    AdminPositionsModalComponent
  ]
})
export class AppModule { }
