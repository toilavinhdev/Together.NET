import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from '~features/feature-user/store/user.reducer';

export const featureUserKey = 'featureUser';

export const featureUserSelector =
  createFeatureSelector<UserState>(featureUserKey);

export const userMeSelector = createSelector(
  featureUserSelector,
  (state) => state.me,
);

export const userViewMeSelector = createSelector(
  featureUserSelector,
  (state) => state.viewMe,
);

export const userProfileDataSelector = createSelector(
  featureUserSelector,
  (state) => state.profile,
);

export const userProfileStatusSelector = createSelector(
  featureUserSelector,
  (state) => state.profileStatus,
);

export const userProfileErrorSelector = createSelector(
  featureUserSelector,
  (state) => state.profileError,
);

export const userUpdateProfileStatusSelector = createSelector(
  featureUserSelector,
  (state) => state.updateProfileStatus,
);

export const userUpdateProfileErrorSelector = createSelector(
  featureUserSelector,
  (state) => state.updateProfileError,
);
