import { createReducer, on } from '@ngrx/store';
import { StatusType } from '~core/types';
import {
  IFollowViewModel,
  IFollowViewModelWithLoading,
} from '~shared/features/feature-follow/store/follow.models';
import { IPagination } from '~core/models';
import {
  follow,
  followFailed,
  followSuccess,
  listFollow,
  listFollowFailed,
  listFollowSuccess,
} from '~shared/features/feature-follow/store/follow.actions';

export interface FollowState {
  listStatus: StatusType;
  followers: IFollowViewModelWithLoading[];
  followersPagination?: IPagination;
  followings: IFollowViewModelWithLoading[];
  followingsPagination?: IPagination;
}

const initialState: FollowState = {
  listStatus: 'idle',
  followers: [],
  followersPagination: undefined,
  followings: [],
  followingsPagination: undefined,
};

export const followReducer = createReducer(
  initialState,
  on(listFollow, (state) => ({
    ...state,
    listStatus: 'loading' as const,
  })),
  on(listFollowSuccess, (state, { data, follower }) => ({
    ...state,
    listStatus: 'success' as const,
    followers: follower
      ? data.pagination.pageIndex === 1
        ? attachLoadingToFollow(data.result)
        : [...state.followers, ...attachLoadingToFollow(data.result)]
      : state.followers,
    followings: !follower
      ? data.pagination.pageIndex === 1
        ? attachLoadingToFollow(data.result)
        : [...state.followings, ...attachLoadingToFollow(data.result)]
      : state.followings,
    followersPagination: follower ? data.pagination : state.followersPagination,
    followingsPagination: !follower
      ? data.pagination
      : state.followingsPagination,
  })),
  on(listFollowFailed, (state) => ({
    ...state,
    listStatus: 'failed' as const,
  })),
  on(follow, (state, { userId }) => ({
    ...state,
    followers: state.followers.map<IFollowViewModelWithLoading>((f) =>
      f.userId === userId ? { ...f, loading: true } : f,
    ),
    followings: state.followings.map<IFollowViewModelWithLoading>((f) =>
      f.userId === userId ? { ...f, loading: true } : f,
    ),
  })),
  on(followSuccess, (state, { userId, follow }) => ({
    ...state,
    followers: state.followers.map<IFollowViewModelWithLoading>((f) =>
      f.userId === userId ? { ...f, loading: false, isFollowing: follow } : f,
    ),
    followings: state.followings.map<IFollowViewModelWithLoading>((f) =>
      f.userId === userId ? { ...f, loading: false, isFollowing: follow } : f,
    ),
  })),
  on(followFailed, (state) => ({
    ...state,
  })),
);

const attachLoadingToFollow = (
  follows: IFollowViewModel[],
): IFollowViewModelWithLoading[] => {
  return follows.map((f) => ({ ...f, loading: false }));
};
