import { createAction, props } from '@ngrx/store';
import {
  IGetMeResponse,
  IGetProfileResponse,
  IUpdateProfileRequest,
} from '~features/feature-user/store/user.models';

const ME = '[Auth] Me';
const ME_SUCCESS = '[Auth] Me Success';
const ME_FAILED = '[Auth] Me Failed';
const GET_PROFILE = '[User] Get Profile';
const GET_PROFILE_SUCCESS = '[User] Get Profile Success';
const GET_PROFILE_FAILED = '[User] Get Profile Failed';
const UPDATE_PROFILE = '[User] Update Profile';
const UPDATE_PROFILE_SUCCESS = '[User] Update Profile Success';
const UPDATE_PROFILE_FAILED = '[User] Update Profile Failed';

export const me = createAction(ME);

export const meSuccess = createAction(
  ME_SUCCESS,
  props<{ response: IGetMeResponse }>(),
);

export const meFailed = createAction(ME_FAILED);

export const getProfile = createAction(
  GET_PROFILE,
  props<{ username: string }>(),
);

export const getProfileSuccess = createAction(
  GET_PROFILE_SUCCESS,
  props<{ profile: IGetProfileResponse }>(),
);

export const getProfileFailed = createAction(
  GET_PROFILE_FAILED,
  props<{ errorCode: string }>(),
);

export const updateProfile = createAction(
  UPDATE_PROFILE,
  props<{ payload: IUpdateProfileRequest }>(),
);

export const updateProfileSuccess = createAction(
  UPDATE_PROFILE_SUCCESS,
  props<{ payload: IUpdateProfileRequest }>(),
);

export const updateProfileFailed = createAction(
  UPDATE_PROFILE_FAILED,
  props<{ errorCode: string }>(),
);
