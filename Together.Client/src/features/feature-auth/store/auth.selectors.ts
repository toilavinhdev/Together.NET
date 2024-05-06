import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '~features/feature-auth/store/auth.reducer';

export const featureAuthKey = 'featureAuth';

export const featureAuthSelector =
  createFeatureSelector<AuthState>(featureAuthKey);

export const authLoadingSelector = createSelector(
  featureAuthSelector,
  (state) => state.loading,
);
