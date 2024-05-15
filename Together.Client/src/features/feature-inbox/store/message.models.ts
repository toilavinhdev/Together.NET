import {
  IBaseParams,
  IPaginationRequest,
  IPaginationResult,
} from '~shared/models';

export interface IListConversationRequest
  extends IPaginationRequest,
    IBaseParams {}

export interface IListConversationResponse
  extends IPaginationResult<IConversationViewModel> {}

export interface IConversationViewModel {
  id: string;
  lastMessage: string;
  lastMessageBySenderUsername: string;
  conversationImageUrl?: string;
  conversationTitle: string;
  lastMessageAt: string;
}

export interface IGetConversationRequest
  extends IBaseParams,
    IPaginationRequest {
  conversationId: string;
}

export interface IGetConversationResponse
  extends IPaginationResult<IMessageViewModel> {
  conversationId: string;
}

export interface IMessageViewModel {
  id: string;
  text: string;
  senderId: string;
  senderUsername: string;
  senderAvatarUrl?: string;
  sendAt: string;
}

export interface ISendMessageRequest {
  conversationId: string;
  text: string;
}

export interface ISendMessageResponse {
  id: string;
  conversationId: string;
  senderId: string;
  senderUsername: string;
  senderAvatarUrl?: string;
  text: string;
  createdAt: string;
}
