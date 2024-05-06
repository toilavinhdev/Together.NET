import { Routes } from '@angular/router';
import { MainContainerComponent } from '~core/main-container/main-container.component';

export const routes: Routes = [
  {
    path: '',
    component: MainContainerComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('~features/feature-posts/feature-posts.routes').then(
            (r) => r.routes,
          ),
      },
      {
        path: 'search',
        loadChildren: () =>
          import('~features/feature-search/feature-search.routes').then(
            (r) => r.routes,
          ),
      },
      {
        path: 'notifications',
        loadChildren: () =>
          import(
            '~features/feature-notifications/feature-notifications.routes'
          ).then((r) => r.routes),
      },
      {
        path: 'messenger',
        loadChildren: () =>
          import('~features/feature-messenger/feature-messenger.routes').then(
            (r) => r.routes,
          ),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('~features/feature-profile/feature-profile.routes').then(
            (r) => r.routes,
          ),
      },
    ],
  },
];
