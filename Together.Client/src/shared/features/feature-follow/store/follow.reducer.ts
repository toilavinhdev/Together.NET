import { createReducer, on } from '@ngrx/store';
import { StatusType } from '~core/types';
import { IFollowViewModel } from '~shared/features/feature-follow/store/follow.models';
import { IPagination } from '~core/models';
import {
  listFollow,
  listFollowSuccess,
} from '~shared/features/feature-follow/store/follow.actions';

export interface FollowState {
  listStatus: StatusType;
  follows: IFollowViewModel[];
  pagination?: IPagination;
}

const initialState: FollowState = {
  listStatus: 'idle',
  follows: [],
  pagination: undefined,
};

export const followReducer = createReducer(
  initialState,
  on(listFollow, (state) => ({
    ...state,
    listStatus: 'loading' as const,
  })),
  on(listFollowSuccess, (state, { data }) => ({
    ...state,
    listStatus: 'success' as const,
    follows: data.result,
    pagination: data.pagination,
  })),
  on(listFollow, (state) => ({
    ...state,
    listStatus: 'failed' as const,
  })),
);
