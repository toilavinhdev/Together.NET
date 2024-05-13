import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MessageState } from '~features/feature-inbox/store/message.reducer';

export const featureMessageKey = 'featureMessage';

export const featureMessageSelector =
  createFeatureSelector<MessageState>(featureMessageKey);

export const messageConversationsSelector = createSelector(
  featureMessageSelector,
  (state) => state.conversations,
);

export const messageConversationsStatusSelector = createSelector(
  featureMessageSelector,
  (state) => state.listConversationsStatus,
);
