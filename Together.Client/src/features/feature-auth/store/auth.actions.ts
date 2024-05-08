import { createAction, props } from '@ngrx/store';
import {
  IForgotPasswordRequest,
  IGetMeResponse,
  INewPasswordRequest,
  ISignInRequest,
  ISignInResponse,
  ISignUpRequest,
  IUserClaimsPrincipal,
  IVerifyForgotPasswordRequest,
} from '~features/feature-auth/store/auth.models';

const SESSION_INITIALIZATION = '[Auth] Session Initialization';
const ME = '[Auth] Me';
const ME_SUCCESS = '[Auth] Me Success';
const ME_FAILED = '[Auth] Me Failed';
const SIGN_IN = '[Auth] Sign In';
const SIGN_IN_SUCCESS = '[Auth] Sign In Success';
const SIGN_IN_FAILED = '[Auth] Sign In Failed';
const LOG_OUT = '[Auth] Logout';
const LOG_OUT_SUCCESS = '[Auth] Logout Success';
const LOG_OUT_FAILED = '[Auth] Logout Failed';
const SIGN_UP = '[Auth] Sign Up';
const SIGN_UP_SUCCESS = '[Auth] Sign Up Success';
const SIGN_UP_FAILED = '[Auth] Sign Up Failed';
const FORGOT_PASSWORD = '[Auth] Forgot Password';
const FORGOT_PASSWORD_SUCCESS = '[Auth] Forgot Password Success';
const FORGOT_PASSWORD_FAILED = '[Auth] Forgot Password Failed';
const VERIFY_FORGOT_PASSWORD_TOKEN = '[Auth] Verify Forgot Password Token';
const VERIFY_FORGOT_PASSWORD_TOKEN_SUCCESS =
  '[Auth] Verify Forgot Password Token Success';
const VERIFY_FORGOT_PASSWORD_TOKEN_FAILED =
  '[Auth] Verify Forgot Password Token Failed';
const NEW_PASSWORD = '[Auth] New Password';
const NEW_PASSWORD_SUCCESS = '[Auth] New Password Success';
const NEW_PASSWORD_FAILED = '[Auth] New Password Failed';

export const me = createAction(ME);

export const meSuccess = createAction(
  ME_SUCCESS,
  props<{ response: IGetMeResponse }>(),
);

export const meFailed = createAction(ME_FAILED);

export const sessionInitialization = createAction(
  SESSION_INITIALIZATION,
  props<{ claims: IUserClaimsPrincipal | null }>(),
);

export const signIn = createAction(
  SIGN_IN,
  props<{ payload: ISignInRequest }>(),
);

export const signInSuccess = createAction(
  SIGN_IN_SUCCESS,
  props<{ response: ISignInResponse }>(),
);

export const signInFailed = createAction(
  SIGN_IN_FAILED,
  props<{ errorCode: string }>(),
);

export const logout = createAction(LOG_OUT);

export const logoutSuccess = createAction(LOG_OUT_SUCCESS);

export const logoutFailed = createAction(LOG_OUT_FAILED);

export const signUp = createAction(
  SIGN_UP,
  props<{ payload: ISignUpRequest }>(),
);

export const signUpSuccess = createAction(SIGN_UP_SUCCESS);

export const signUpFailed = createAction(
  SIGN_UP_FAILED,
  props<{ errorCode: string }>(),
);

export const forgotPassword = createAction(
  FORGOT_PASSWORD,
  props<{ payload: IForgotPasswordRequest }>(),
);

export const forgotPasswordSuccess = createAction(FORGOT_PASSWORD_SUCCESS);

export const forgotPasswordFailed = createAction(
  FORGOT_PASSWORD_FAILED,
  props<{ errorCode: string }>(),
);

export const verifyForgotPasswordToken = createAction(
  VERIFY_FORGOT_PASSWORD_TOKEN,
  props<{ params: IVerifyForgotPasswordRequest }>(),
);

export const verifyForgotPasswordTokenSuccess = createAction(
  VERIFY_FORGOT_PASSWORD_TOKEN_SUCCESS,
  props<{ verify: IVerifyForgotPasswordRequest }>(),
);

export const verifyForgotPasswordTokenFailed = createAction(
  VERIFY_FORGOT_PASSWORD_TOKEN_FAILED,
  props<{ errorCode: string }>(),
);

export const newPassword = createAction(
  NEW_PASSWORD,
  props<{ payload: INewPasswordRequest }>(),
);

export const newPasswordSuccess = createAction(NEW_PASSWORD_SUCCESS);

export const newPasswordFailed = createAction(
  NEW_PASSWORD_FAILED,
  props<{ errorCode: string }>(),
);
