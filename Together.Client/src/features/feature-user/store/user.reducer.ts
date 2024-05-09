import {
  IGetMeResponse,
  IGetProfileResponse,
} from '~features/feature-user/store/user.models';
import { createReducer, on } from '@ngrx/store';
import {
  getProfile,
  getProfileFailed,
  getProfileSuccess,
  me,
  meFailed,
  meSuccess,
  updateProfile,
  updateProfileFailed,
  updateProfileSuccess,
} from '~features/feature-user/store/user.actions';
import { StatusType } from '~core/types';
import { followSuccess } from '~shared/features/feature-follow/store';

export interface UserState {
  me: IGetMeResponse | null;
  profile: IGetProfileResponse | null;
  viewMe: boolean;
  profileStatus: StatusType;
  profileError: string | null;
  updateProfileStatus: StatusType;
  updateProfileError: string | null;
}

const initialState: UserState = {
  me: null,
  profile: null,
  viewMe: false,
  profileStatus: 'idle',
  profileError: null,
  updateProfileStatus: 'idle',
  updateProfileError: null,
};

export const userReducer = createReducer(
  initialState,
  on(me, (state) => ({ ...state, loading: true })),
  on(meSuccess, (state, { response }) => ({
    ...state,
    loading: false,
    me: response,
  })),
  on(meFailed, (state) => ({ ...state, loading: false })),
  on(getProfile, (state) => ({
    ...state,
    profileStatus: 'loading' as const,
    profileError: null,
  })),
  on(getProfileSuccess, (state, { profile }) => ({
    ...state,
    profile,
    profileStatus: 'success' as const,
    profileError: null,
    viewMe: profile.id == state.me!.id,
  })),
  on(getProfileFailed, (state, { errorCode }) => ({
    ...state,
    profileStatus: 'failed' as const,
    profileError: errorCode,
  })),
  on(updateProfile, (state) => ({
    ...state,
    updateProfileStatus: 'loading' as const,
    updateProfileError: null,
  })),
  on(updateProfileSuccess, (state, { payload }) => ({
    ...state,
    updateProfileStatus: 'success' as const,
    updateProfileError: null,
    profile: {
      ...state.profile!,
      ...payload,
    },
  })),
  on(updateProfileFailed, (state, { errorCode }) => ({
    ...state,
    updateProfileStatus: 'failed' as const,
    updateProfileError: errorCode,
  })),
  //extra
  on(followSuccess, (state, { userId, follow }) => ({
    ...state,
    profile: {
      ...state.profile!,
      isFollowing:
        state.profile!.id === userId
          ? !state.profile!.isFollowing
          : state.profile!.isFollowing,
      totalFollower: state.viewMe
        ? state.profile!.totalFollower
        : state.profile!.totalFollower + (follow ? 1 : -1),
      totalFollowing: state.viewMe
        ? state.profile!.totalFollowing + (follow ? 1 : -1)
        : state.profile!.totalFollowing,
    },
  })),
);
