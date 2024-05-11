import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FollowState } from '~shared/features/feature-follow/store/follow.reducer';
import { IListFollowResponse } from '~shared/features/feature-follow/store/follow.models';

export const featureFollowKey = 'featureFollow ';

export const featureFollowSelector =
  createFeatureSelector<FollowState>(featureFollowKey);

export const followListStatusSelector = createSelector(
  featureFollowSelector,
  (state) => state.listStatus,
);

export const followersSelector = createSelector(
  featureFollowSelector,
  (state) =>
    ({
      result: state.followers,
      pagination: state.followersPagination,
    }) as IListFollowResponse,
);

export const followingsSelector = createSelector(
  featureFollowSelector,
  (state) =>
    ({
      result: state.followings,
      pagination: state.followingsPagination,
    }) as IListFollowResponse,
);
