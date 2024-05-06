import { createReducer, on } from '@ngrx/store';
import {
  forgotPassword,
  forgotPasswordFailed,
  forgotPasswordSuccess,
  newPassword,
  newPasswordFailed,
  newPasswordSuccess,
  signIn,
  signInFailed,
  signInSuccess,
  signUp,
  signUpFailed,
  signUpSuccess,
  verifyForgotPasswordToken,
  verifyForgotPasswordTokenFailed,
  verifyForgotPasswordTokenSuccess,
} from '~features/feature-auth/store/auth.actions';

export interface AuthState {
  loading: boolean;
}

const initialState: AuthState = {
  loading: false,
};

export const authReducer = createReducer(
  initialState,
  on(signIn, (state) => ({ ...state, loading: true })),
  on(signInSuccess, (state) => ({ ...state, loading: false })),
  on(signInFailed, (state) => ({ ...state, loading: false })),
  on(signUp, (state) => ({ ...state, loading: true })),
  on(signUpSuccess, (state) => ({ ...state, loading: false })),
  on(signUpFailed, (state) => ({ ...state, loading: false })),
  on(forgotPassword, (state) => ({ ...state, loading: true })),
  on(forgotPasswordSuccess, (state) => ({
    ...state,
    loading: false,
  })),
  on(forgotPasswordFailed, (state) => ({ ...state, loading: false })),
  on(verifyForgotPasswordToken, (state) => ({ ...state, loading: true })),
  on(verifyForgotPasswordTokenSuccess, (state) => ({
    ...state,
    loading: false,
  })),
  on(verifyForgotPasswordTokenFailed, (state) => ({
    ...state,
    loading: false,
  })),
  on(newPassword, (state) => ({ ...state, loading: true })),
  on(newPasswordSuccess, (state) => ({
    ...state,
    loading: false,
  })),
  on(newPasswordFailed, (state) => ({ ...state, loading: false })),
);
