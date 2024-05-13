import {
  IBaseParams,
  IPaginationRequest,
  IPaginationResult,
} from '~shared/models';

export interface IListFollowRequest extends IPaginationRequest, IBaseParams {
  userId: string;
  follower: boolean;
}

export interface IListFollowResponse
  extends IPaginationResult<IFollowViewModel> {}

export interface IFollowViewModel {
  id: string;
  userId: string;
  fullName: string;
  username: string;
  avatarUrl?: string;
  isFollowing: boolean;
}

export interface IFollowViewModelWithLoading extends IFollowViewModel {
  loading: boolean;
}
