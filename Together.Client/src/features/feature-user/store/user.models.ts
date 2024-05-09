import { EGender } from '~shared/enums';

export interface IGetMeResponse {
  id: string;
  fullName: string;
  email: string;
  username?: string;
  avatarUrl?: string;
}

export interface IGetProfileResponse {
  id: string;
  fullName: string;
  username?: string;
  avatarUrl?: string;
  bio?: string;
  dob?: number;
  gender: EGender;
  isFollowing: boolean;
  totalFollower: number;
  totalFollowing: number;
}

export interface IUpdateProfileRequest {
  fullName: string;
  avatarUrl?: string;
  bio?: string;
  dob?: number;
  gender?: EGender;
}
