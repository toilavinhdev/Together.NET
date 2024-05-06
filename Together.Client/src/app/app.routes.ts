import { Routes } from '@angular/router';
import { authGuard } from '~core/guards';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('~core/main-container/main-container.routes').then(
        (r) => r.routes,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('~features/feature-auth/feature-auth.routes').then(
        (r) => r.routes,
      ),
  },
];
