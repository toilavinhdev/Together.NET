import { createAction, props } from '@ngrx/store';
import {
  IListFollowRequest,
  IListFollowResponse,
} from '~shared/features/feature-follow/store/follow.models';

const FOLLOW = '[Follow] Follow';
const FOLLOW_SUCCESS = '[Follow] Follow Success';
const FOLLOW_FAILED = '[Follow] Follow Failed';
const LIST_FOLLOW = '[Follow] List Follow';
const LIST_FOLLOW_SUCCESS = '[Follow] List Follow Success';
const LIST_FOLLOW_FAILED = '[Follow] List Follow Failed';

export const follow = createAction(FOLLOW, props<{ userId: string }>());
export const followSuccess = createAction(
  FOLLOW_SUCCESS,
  props<{ userId: string; follow: boolean }>(),
);
export const followFailed = createAction(
  FOLLOW_FAILED,
  props<{ userId: string; errorCode: string }>(),
);

export const listFollow = createAction(
  LIST_FOLLOW,
  props<{ request: IListFollowRequest }>(),
);
export const listFollowSuccess = createAction(
  LIST_FOLLOW_SUCCESS,
  props<{ data: IListFollowResponse; follower: boolean }>(),
);
export const listFollowFailed = createAction(
  LIST_FOLLOW_FAILED,
  props<{ errorCode: string }>(),
);
