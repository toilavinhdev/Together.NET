import { IGetProfileResponse } from '~features/feature-user/store/user.models';
import { createReducer, on } from '@ngrx/store';
import {
  getProfile,
  getProfileFailed,
  getProfileSuccess,
  updateProfile,
  updateProfileFailed,
  updateProfileSuccess,
} from '~features/feature-user/store/user.actions';
import { StatusType } from '~core/types';

export interface UserState {
  profile: {
    data: IGetProfileResponse | null;
    status: StatusType;
    error: string | null;
  };
  updateProfile: {
    status: StatusType;
    error: string | null;
  };
}

const initialState: UserState = {
  profile: {
    data: null,
    status: 'idle',
    error: null,
  },
  updateProfile: {
    status: 'idle',
    error: null,
  },
};

export const userReducer = createReducer(
  initialState,
  on(getProfile, (state) => ({
    ...state,
    profile: {
      ...state.profile,
      status: 'loading' as const,
      error: null,
    },
  })),
  on(getProfileSuccess, (state, { profile }) => ({
    ...state,
    profile: {
      ...state.profile,
      data: profile,
      status: 'success' as const,
    },
  })),
  on(getProfileFailed, (state, { errorCode }) => ({
    ...state,
    profile: {
      ...state.profile,
      status: 'failed' as const,
      error: errorCode,
    },
  })),
  on(updateProfile, (state) => ({
    ...state,
    updateProfile: {
      ...state.updateProfile,
      status: 'loading' as const,
      error: null,
    },
  })),
  on(updateProfileSuccess, (state, { payload }) => ({
    ...state,
    updateProfile: {
      ...state.updateProfile,
      status: 'success' as const,
    },
    profile: {
      ...state.profile,
      data: { ...state.profile.data!, ...payload },
    },
  })),
  on(updateProfileFailed, (state, { errorCode }) => ({
    ...state,
    updateProfile: {
      ...state.updateProfile,
      status: 'failed' as const,
      error: errorCode,
    },
  })),
);
