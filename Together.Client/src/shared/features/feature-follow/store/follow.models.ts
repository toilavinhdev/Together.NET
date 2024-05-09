import {
  IBaseParams,
  IPaginationRequest,
  IPaginationResult,
} from '~core/models';

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
