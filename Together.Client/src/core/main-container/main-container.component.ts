import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '~core/main-container/navbar/navbar.component';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import {
  IGetMeResponse,
  me,
  userMeSelector,
} from '~features/feature-user/store';

@Component({
  selector: 'together-main-container',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, NgIf, AsyncPipe],
  templateUrl: './main-container.component.html',
})
export class MainContainerComponent implements OnInit {
  me$: Observable<IGetMeResponse | null> = this.store.select(userMeSelector);

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(me());
  }
}
