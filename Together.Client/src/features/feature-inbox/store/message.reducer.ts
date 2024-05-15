import { createReducer, on } from '@ngrx/store';
import { StatusType } from '~shared/types';
import {
  getConversation,
  getConversationFailed,
  getConversationSuccess,
  listConversation,
  listConversationFailed,
  listConversationSuccess,
  receivedMessage,
  sendMessage,
  sendMessageFailed,
  sendMessageSuccess,
} from '~features/feature-inbox/store/message.actions';
import { IPagination } from '~shared/models';
import {
  IConversationViewModel,
  IMessageViewModel,
} from '~features/feature-inbox/store/message.models';

export interface MessageState {
  listConversation: IConversationViewModel[];
  listConversationPagination?: IPagination;
  listConversationStatus: StatusType;
  conversation?: { conversationId: string; messages: IMessageViewModel[] };
}

const initialState: MessageState = {
  listConversation: [],
  listConversationPagination: undefined,
  listConversationStatus: 'idle',
  conversation: undefined,
};

export const messageReducer = createReducer(
  initialState,
  on(listConversation, (state) => ({
    ...state,
  })),
  on(listConversationSuccess, (state, { response }) => ({
    ...state,
    listConversation: response.result,
  })),
  on(listConversationFailed, (state) => ({
    ...state,
  })),
  on(getConversation, (state) => ({
    ...state,
  })),
  on(getConversationSuccess, (state, { response }) => ({
    ...state,
    conversation: {
      conversationId: response.conversationId,
      messages: response.result,
    },
  })),
  on(getConversationFailed, (state) => ({
    ...state,
  })),
  on(sendMessage, (state) => ({
    ...state,
  })),
  on(sendMessageSuccess, (state, { data }) => ({
    ...state,
    conversation: {
      ...state.conversation!,
      messages: [
        ...state.conversation!.messages,
        {
          id: data.id,
          senderId: data.senderId,
          sendAt: data.createdAt,
          senderAvatarUrl: data.senderAvatarUrl,
          senderUsername: data.senderUsername,
          text: data.text,
        },
      ],
    },
    listConversation: state.listConversation
      .map((c) => {
        if (c.id === data.conversationId) {
          return {
            ...c,
            lastMessage: data.text,
            lastMessageBySenderUsername: data.senderUsername,
            lastMessageAt: data.createdAt,
          };
        }
        return c;
      })
      .sort(
        (a, b) =>
          new Date(b.lastMessageAt).getTime() -
          new Date(a.lastMessageAt).getTime(),
      ),
  })),
  on(sendMessageFailed, (state) => ({
    ...state,
  })),
  on(receivedMessage, (state, { message }) => ({
    ...state,
    conversation:
      state.conversation!.conversationId === message.conversationId
        ? {
            ...state.conversation!,
            messages: [
              ...state.conversation!.messages,
              {
                id: message.id,
                senderId: message.senderId,
                sendAt: message.createdAt,
                senderAvatarUrl: message.senderAvatarUrl,
                senderUsername: message.senderUsername,
                text: message.text,
              },
            ],
          }
        : { ...state.conversation! },
  })),
);
