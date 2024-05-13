import { Component } from '@angular/core';
import {
  InboxConversationComponent,
  InboxRecentConversationsComponent,
} from '~features/feature-inbox/components';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'together-feature-inbox',
  standalone: true,
  imports: [
    InboxRecentConversationsComponent,
    InboxConversationComponent,
    RouterOutlet,
  ],
  templateUrl: './feature-inbox.component.html',
  styles: ``,
})
export class FeatureInboxComponent {}
