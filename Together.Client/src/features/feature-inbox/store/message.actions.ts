import { createAction, props } from '@ngrx/store';
import {
  IGetConversationRequest,
  IGetConversationResponse,
  IListConversationRequest,
  IListConversationResponse,
} from '~features/feature-inbox/store/message.models';

const LIST_CONVERSATION = '[Message] List Conversation';
const LIST_CONVERSATION_SUCCESS = '[Message] List Conversation Success';
const LIST_CONVERSATION_FAILED = '[Message] List Conversation Failed';
const GET_CONVERSATION = '[Message] Get Conversation';
const GET_CONVERSATION_SUCCESS = '[Message] Get Conversation Success';
const GET_CONVERSATION_FAILED = '[Message] Get Conversation Failed';

export const listConversation = createAction(
  LIST_CONVERSATION,
  props<{ params: IListConversationRequest }>(),
);

export const listConversationSuccess = createAction(
  LIST_CONVERSATION_SUCCESS,
  props<{ response: IListConversationResponse }>(),
);

export const listConversationFailed = createAction(LIST_CONVERSATION_FAILED);

export const getConversation = createAction(
  GET_CONVERSATION,
  props<{ params: IGetConversationRequest }>(),
);

export const getConversationSuccess = createAction(
  GET_CONVERSATION_SUCCESS,
  props<{ conversationId: string; response: IGetConversationResponse }>(),
);

export const getConversationFailed = createAction(GET_CONVERSATION_FAILED);
