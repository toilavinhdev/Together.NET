import { createAction, props } from '@ngrx/store';
import {
  IGetConversationRequest,
  IGetConversationResponse,
  IListConversationRequest,
  IListConversationResponse,
  ISendMessageRequest,
  ISendMessageResponse,
} from '~features/feature-inbox/store/message.models';

const LIST_CONVERSATION = '[Message] List Conversation';
const LIST_CONVERSATION_SUCCESS = '[Message] List Conversation Success';
const LIST_CONVERSATION_FAILED = '[Message] List Conversation Failed';
const GET_CONVERSATION = '[Message] Get Conversation';
const GET_CONVERSATION_SUCCESS = '[Message] Get Conversation Success';
const GET_CONVERSATION_FAILED = '[Message] Get Conversation Failed';
const SEND_MESSAGE = '[Message] Send Message';
const SEND_MESSAGE_SUCCESS = '[Message] Send Message Success';
const SEND_MESSAGE_FAILED = '[Message] Send Message Failed';
const RECEIVED_MESSAGE = '[Message] Received Message';

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
  props<{ response: IGetConversationResponse }>(),
);

export const getConversationFailed = createAction(GET_CONVERSATION_FAILED);

export const sendMessage = createAction(
  SEND_MESSAGE,
  props<{ payload: ISendMessageRequest }>(),
);

export const sendMessageSuccess = createAction(
  SEND_MESSAGE_SUCCESS,
  props<{ data: ISendMessageResponse }>(),
);

export const sendMessageFailed = createAction(SEND_MESSAGE_FAILED);

export const receivedMessage = createAction(
  RECEIVED_MESSAGE,
  props<{ message: ISendMessageResponse }>(),
);
