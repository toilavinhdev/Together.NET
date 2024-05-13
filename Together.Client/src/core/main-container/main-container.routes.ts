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
        path: 'inbox',
        loadChildren: () =>
          import('~features/feature-inbox/feature-inbox.routes').then(
            (r) => r.routes,
          ),
      },
      {
        path: 'profile/:username',
        loadChildren: () =>
          import('~features/feature-user/feature-user.routes').then(
            (r) => r.routes,
          ),
      },
    ],
  },
];
