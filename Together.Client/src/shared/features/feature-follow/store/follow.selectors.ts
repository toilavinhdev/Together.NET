import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FollowState } from '~shared/features/feature-follow/store/follow.reducer';

export const featureFollowKey = 'featureFollow ';

export const featureFollowSelector =
  createFeatureSelector<FollowState>(featureFollowKey);

export const followListStatusSelector = createSelector(
  featureFollowSelector,
  (state) => state.listStatus,
);

export const followListDataSelector = createSelector(
  featureFollowSelector,
  (state) => state.follows,
);

export const followListPaginationSelector = createSelector(
  featureFollowSelector,
  (state) => state.pagination,
);
