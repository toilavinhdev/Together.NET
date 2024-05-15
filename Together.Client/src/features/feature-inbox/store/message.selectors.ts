import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MessageState } from '~features/feature-inbox/store/message.reducer';

export const featureMessageKey = 'featureMessage';

export const featureMessageSelector =
  createFeatureSelector<MessageState>(featureMessageKey);

export const messageListConversationSelector = createSelector(
  featureMessageSelector,
  (state) => state.listConversation,
);

export const messageListConversationStatusSelector = createSelector(
  featureMessageSelector,
  (state) => state.listConversationStatus,
);

export const messageConversationSelector = createSelector(
  featureMessageSelector,
  (state) => state.conversation,
);
