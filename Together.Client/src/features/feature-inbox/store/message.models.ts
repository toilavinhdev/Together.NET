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
  lastMessageBySenderAvatar: string;
  lastMessageAt: string;
}

export interface IGetConversationRequest
  extends IBaseParams,
    IPaginationRequest {
  conversationId: string;
}

export interface IGetConversationResponse
  extends IPaginationResult<IMessageViewModel> {}

export interface IMessageViewModel {
  id: string;
  text: string;
  senderUsername: string;
  senderAvatarUrl?: string;
}

export interface IConservationData extends IConversationViewModel {
  messages: IMessageViewModel[];
}
