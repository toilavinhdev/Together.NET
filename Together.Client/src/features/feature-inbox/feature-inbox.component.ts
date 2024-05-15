import { Component } from '@angular/core';
import {
  InboxConversationComponent,
  InboxRecentConversationsComponent,
} from '~features/feature-inbox/components';
import { RouterOutlet } from '@angular/router';
import { BaseComponent } from '~core/abstractions';
import { IGetMeResponse, userMeSelector } from '~features/feature-user/store';
import { Observable, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'together-feature-inbox',
  standalone: true,
  imports: [
    InboxRecentConversationsComponent,
    InboxConversationComponent,
    RouterOutlet,
    AsyncPipe,
  ],
  templateUrl: './feature-inbox.component.html',
  styles: ``,
})
export class FeatureInboxComponent extends BaseComponent {
  me$: Observable<IGetMeResponse | null> = this.store
    .select(userMeSelector)
    .pipe(takeUntil(this.destroy$));

  constructor(private store: Store) {
    super();
  }
}
