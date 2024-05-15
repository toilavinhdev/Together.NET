import { createFeatureSelector } from '@ngrx/store';
import { PostState } from '~features/feature-posts/store/post.reducer';

export const featurePostKey = 'featurePost';

export const featurePostSelector =
  createFeatureSelector<PostState>(featurePostKey);
