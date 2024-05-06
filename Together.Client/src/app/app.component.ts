import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  GlobalLoadingComponent,
  SvgDefinitionsComponent,
} from '~shared/components';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SvgDefinitionsComponent, GlobalLoadingComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {}
