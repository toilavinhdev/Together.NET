import { EGender } from '~shared/enums';

export interface IGetProfileResponse {
  id: string;
  fullName: string;
  username?: string;
  avatarUrl?: string;
  bio?: string;
  dob?: number;
  gender: EGender;
}

export interface IUpdateProfileRequest {
  fullName: string;
  avatarUrl?: string;
  bio?: string;
  dob?: number;
  gender?: EGender;
}
