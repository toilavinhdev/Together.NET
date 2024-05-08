import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '~features/feature-auth/store/auth.reducer';

export const featureAuthKey = 'featureAuth';

export const featureAuthSelector =
  createFeatureSelector<AuthState>(featureAuthKey);

export const authClaimsSelector = createSelector(
  featureAuthSelector,
  (state) => state.claims,
);

export const authAuthenticatedSelector = createSelector(
  featureAuthSelector,
  (state) => !!state.claims && state.claims.exp * 1000 > Date.now(),
);

export const authLoadingSelector = createSelector(
  featureAuthSelector,
  (state) => state.loading,
);

export const authMeSelector = createSelector(
  featureAuthSelector,
  (state) => state.me,
);
