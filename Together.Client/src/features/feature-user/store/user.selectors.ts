import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from '~features/feature-user/store/user.reducer';

export const featureUserKey = 'featureUser';

export const featureUserSelector =
  createFeatureSelector<UserState>(featureUserKey);

export const userProfileDataSelector = createSelector(
  featureUserSelector,
  (state) => state.profile.data,
);

export const userProfileStatusSelector = createSelector(
  featureUserSelector,
  (state) => state.profile.status,
);

export const userProfileErrorSelector = createSelector(
  featureUserSelector,
  (state) => state.profile.error,
);

export const userUpdateProfileStatusSelector = createSelector(
  featureUserSelector,
  (state) => state.updateProfile.status,
);

export const userUpdateProfileErrorSelector = createSelector(
  featureUserSelector,
  (state) => state.updateProfile.error,
);
