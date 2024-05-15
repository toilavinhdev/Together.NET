import { createReducer, on } from '@ngrx/store';
import {
  likePost,
  likePostFailed,
  likePostSuccess,
  newPost,
  newPostFailed,
  newPostSuccess,
  reply,
  replyFailed,
  replySuccess,
} from '~features/feature-posts/store/post.actions';

export interface PostState {}

const initialState: PostState = {};

export const postReducer = createReducer(
  initialState,
  on(newPost, (state) => state),
  on(newPostSuccess, (state) => state),
  on(newPostFailed, (state) => state),
  on(reply, (state) => state),
  on(replySuccess, (state) => state),
  on(replyFailed, (state) => state),
  on(likePost, (state) => state),
  on(likePostSuccess, (state) => state),
  on(likePostFailed, (state) => state),
);
