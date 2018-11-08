import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

// Shared components
import { FooterComponent, NavBarComponent, MobileNavComponent, UserBubbleComponent} from '../shared-ng/components/components';
import { RequestService } from '../shared-ng/services/services';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    UserBubbleComponent,
    MobileNavComponent,
    FooterComponent
  ],
  imports: [
    NgbModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    RequestService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
