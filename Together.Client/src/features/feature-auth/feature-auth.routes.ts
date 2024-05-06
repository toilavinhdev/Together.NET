import { Routes } from '@angular/router';
import { FeatureAuthComponent } from '~features/feature-auth/feature-auth.component';

export const routes: Routes = [
  {
    path: '',
    component: FeatureAuthComponent,
    children: [
      {
        path: '',
        redirectTo: 'sign-in',
        pathMatch: 'full',
      },
      {
        path: 'sign-in',
        loadComponent: () =>
          import('./components/sign-in/sign-in.component').then(
            (c) => c.SignInComponent,
          ),
      },
      {
        path: 'sign-up',
        loadComponent: () =>
          import('./components/sign-up/sign-up.component').then(
            (c) => c.SignUpComponent,
          ),
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./components/forgot-password/forgot-password.component').then(
            (c) => c.ForgotPasswordComponent,
          ),
      },
      {
        path: 'forgot-password/:userId/:token',
        loadComponent: () =>
          import('./components/forgot-password/forgot-password.component').then(
            (c) => c.ForgotPasswordComponent,
          ),
      },
    ],
  },
];
