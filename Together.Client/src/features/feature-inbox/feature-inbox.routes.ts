import { Routes } from '@angular/router';
import { FeatureInboxComponent } from '~features/feature-inbox/feature-inbox.component';

export const routes: Routes = [
  {
    path: '',
    component: FeatureInboxComponent,
    children: [
      {
        path: ':conversationId',
        loadComponent: () =>
          import(
            './components/inbox-conversation/inbox-conversation.component'
          ).then((c) => c.InboxConversationComponent),
      },
    ],
  },
];
