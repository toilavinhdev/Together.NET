import { createAction, props } from '@ngrx/store';
import {
  ICreatePostRequest,
  ICreatePostResponse,
  ICreateReplyRequest,
  ICreateReplyResponse,
} from '~features/feature-posts/store/post.models';

const NEW_POST = '[Post] New Post';
const NEW_POST_SUCCESS = '[Post] New Post Success';
const NEW_POST_FAILED = '[Post] New Post Failed';
const REPLY = '[Post] Reply';
const REPLY_SUCCESS = '[Post] Reply Success';
const REPLY_FAILED = '[Post] Reply Failed';
const LIKE_POST = '[Post] Like Post';
const LIKE_POST_SUCCESS = '[Post] Like Post Success';
const LIKE_POST_FAILED = '[Post] Like Post Failed';

export const newPost = createAction(
  NEW_POST,
  props<{ payload: ICreatePostRequest }>(),
);

export const newPostSuccess = createAction(
  NEW_POST_SUCCESS,
  props<{ response: ICreatePostResponse }>(),
);

export const newPostFailed = createAction(NEW_POST_FAILED);

export const reply = createAction(
  REPLY,
  props<{ payload: ICreateReplyRequest }>(),
);

export const replySuccess = createAction(
  REPLY_SUCCESS,
  props<{ response: ICreateReplyResponse }>(),
);

export const replyFailed = createAction(REPLY_FAILED);

export const likePost = createAction(LIKE_POST, props<{ postId: string }>());

export const likePostSuccess = createAction(LIKE_POST_SUCCESS);

export const likePostFailed = createAction(LIKE_POST_FAILED);
