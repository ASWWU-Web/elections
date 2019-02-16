import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  HomeComponent,
  VoteComponent,
  AdminComponent
} from './routes/routes';

const routes: Routes = [
  {
    'path': '',
    component: HomeComponent
  },
  {
    'path': 'vote',
    component: VoteComponent
  },
  {
    'path': 'admin',
    component: AdminComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
