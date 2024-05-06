import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'together-main-container',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class MainContainerComponent {}
