import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import {
  accessTokenInterceptor,
  errorHandlerInterceptor,
} from '~core/interceptors';
import {
  AuthEffects,
  authReducer,
  featureAuthKey,
} from '~features/feature-auth/store';
import {
  featureUserKey,
  UserEffects,
  userReducer,
} from '~features/feature-user/store';
import {
  featureFollowKey,
  FollowEffects,
  followReducer,
} from '~shared/features/feature-follow/store';
import { NzConfig, provideNzConfig } from 'ng-zorro-antd/core/config';

registerLocaleData(en);

const stores = {
  [featureAuthKey]: authReducer,
  [featureUserKey]: userReducer,
  [featureFollowKey]: followReducer,
};

const effects = [AuthEffects, UserEffects, FollowEffects];

const nzConfig: NzConfig = {
  notification: {
    nzPlacement: 'bottomRight',
    nzMaxStack: 5,
    nzPauseOnHover: true,
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideNzI18n(en_US),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([accessTokenInterceptor, errorHandlerInterceptor]),
    ),
    provideStore(stores),
    provideEffects(effects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideNzConfig(nzConfig),
  ],
};
