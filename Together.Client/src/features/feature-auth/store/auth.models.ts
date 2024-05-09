export interface IUserClaimsPrincipal {
  exp: number;
  id: string;
  username: string;
  email: string;
}

export interface ISignInRequest {
  email: string;
  password: string;
}

export interface ISignInResponse {
  accessToken: string;
}

export interface ISignUpRequest {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IForgotPasswordRequest {
  email: string;
}

export interface IVerifyForgotPasswordRequest {
  userId: string;
  token: string;
}

export interface INewPasswordRequest {
  userId: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}
