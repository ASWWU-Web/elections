import { Component } from '@angular/core';
import { HermesService } from 'src/shared-ng/services/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private hermesService: HermesService) {
    this.hermesService.sendHeaderTitle('Elections');
  }
}
