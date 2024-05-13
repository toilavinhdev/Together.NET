import { createReducer, on } from '@ngrx/store';
import {
  IConservationData,
  IConversationViewModel,
  IMessageViewModel,
} from '~features/feature-inbox/store/message.models';
import { StatusType } from '~shared/types';
import {
  getConversation,
  getConversationFailed,
  getConversationSuccess,
  listConversation,
  listConversationFailed,
  listConversationSuccess,
} from '~features/feature-inbox/store/message.actions';
import { IPagination } from '~shared/models';

export interface MessageState {
  conversations: IConservationData[];
  listConversationsPagination?: IPagination;
  listConversationsStatus: StatusType;
}

const initialState: MessageState = {
  conversations: [],
  listConversationsPagination: undefined,
  listConversationsStatus: 'idle',
};

export const messageReducer = createReducer(
  initialState,
  on(listConversation, (state) => ({
    ...state,
    listConversationsStatus: 'loading' as const,
  })),
  on(listConversationSuccess, (state, { response }) => ({
    ...state,
    conversations: response.result.map(
      (c) => ({ ...c, messages: [] }) as IConservationData,
    ),
    listConversationsPagination: response.pagination,
    listConversationsStatus: 'success' as const,
  })),
  on(listConversationFailed, (state) => ({
    ...state,
    listConversationsStatus: 'failed' as const,
  })),
  on(getConversation, (state) => ({
    ...state,
  })),
  on(getConversationSuccess, (state, { response, conversationId }) => ({
    ...state,
    conversations: state.conversations.map<IConservationData>((c) =>
      c.id === conversationId
        ? {
            ...c,
            messages:
              response.pagination.pageIndex === 1
                ? response.result
                : [...c.messages, ...response.result],
          }
        : c,
    ),
  })),
  on(getConversationFailed, (state) => ({
    ...state,
  })),
);
