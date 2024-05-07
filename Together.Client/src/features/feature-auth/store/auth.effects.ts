import { Injectable } from '@angular/core';
import {
  Actions,
  createEffect,
  ofType,
  ROOT_EFFECTS_INIT,
} from '@ngrx/effects';
import { AuthService } from '~features/feature-auth/store/auth.service';
import {
  forgotPassword,
  forgotPasswordFailed,
  forgotPasswordSuccess,
  newPassword,
  newPasswordFailed,
  newPasswordSuccess,
  sessionInitialization,
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
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonService } from '~shared/services';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private notificationService: NzNotificationService,
    private commonService: CommonService,
  ) {}

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      switchMap(() => {
        return of(
          sessionInitialization({
            claims: this.authService.getUserClaimsPrincipal(),
          }),
        );
      }),
    ),
  );

  signIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signIn),
      switchMap(({ payload }) =>
        this.authService.signIn(payload).pipe(
          switchMap((response) => [
            signInSuccess({ response: response }),
            sessionInitialization({
              claims: this.authService.decodeToken(response.accessToken),
            }),
          ]),
          catchError((err: HttpErrorResponse) =>
            of(signInFailed({ errorCode: err.error.errors[0].code })),
          ),
        ),
      ),
    ),
  );

  signInSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(signInSuccess),
        tap(({ response }) => {
          this.authService.setToken(response.accessToken);
          this.notificationService.success('Đăng nhập thành công', '');
          this.commonService.redirectToMain();
        }),
      ),
    {
      dispatch: false,
    },
  );

  signInFailed$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(signInFailed),
        tap(({ errorCode }) => {
          switch (errorCode) {
            case 'USER_NOT_FOUND':
              this.notificationService.error('Người dùng không tồn tại', '');
              break;
            case 'INCORRECT_PASSWORD':
              this.notificationService.error('Mật khẩu không chính xác', '');
              break;
            default:
              this.notificationService.error('Có lỗi xảy ra khi đăng nhập', '');
          }
        }),
      ),
    {
      dispatch: false,
    },
  );

  signUp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signUp),
      switchMap(({ payload }) =>
        this.authService.signUp(payload).pipe(
          map(() => signUpSuccess()),
          catchError((err: HttpErrorResponse) =>
            of(signUpFailed({ errorCode: err.error.errors[0].code })),
          ),
        ),
      ),
    ),
  );

  signUpSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(signUpSuccess),
        tap(() => {
          this.notificationService.success('Đăng ký thành công', '');
          this.commonService.redirectToLogin();
        }),
      ),
    { dispatch: false },
  );

  signUpFailed$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(signUpFailed),
        tap(({ errorCode }) => {
          console.log(111, errorCode);
          switch (errorCode) {
            case 'USERNAME_ALREADY_EXISTS':
              this.notificationService.error(
                'Tên người dùng đã được sử dụng',
                '',
              );
              break;
            default:
              this.notificationService.error('Có lỗi xảy ra khi đăng ký', '');
          }
        }),
      ),
    { dispatch: false },
  );

  forgotPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(forgotPassword),
      switchMap(({ payload }) =>
        this.authService.forgotPassword(payload).pipe(
          map(() => forgotPasswordSuccess()),
          catchError((err: HttpErrorResponse) =>
            of(forgotPasswordFailed({ errorCode: err.error.errors[0].code })),
          ),
        ),
      ),
    ),
  );

  forgotPasswordSuccess$ = createEffect(
    () => this.actions$.pipe(ofType(forgotPasswordSuccess)),
    { dispatch: false },
  );

  forgotPasswordFailed$ = createEffect(
    () => this.actions$.pipe(ofType(forgotPasswordFailed)),
    { dispatch: false },
  );

  verifyForgotPasswordToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(verifyForgotPasswordToken),
      switchMap(({ params }) =>
        this.authService.verifyForgotPasswordToken(params).pipe(
          map((res) => verifyForgotPasswordTokenSuccess({ verify: params })),
          catchError((err: HttpErrorResponse) =>
            of(
              verifyForgotPasswordTokenFailed({
                errorCode:
                  err.status === 404 ? 'NOTFOUND' : err.error.errors[0].code,
              }),
            ),
          ),
        ),
      ),
    ),
  );

  verifyForgotPasswordTokenSuccess$ = createEffect(
    () => this.actions$.pipe(ofType(verifyForgotPasswordTokenSuccess)),
    { dispatch: false },
  );

  verifyForgotPasswordTokenFailed$ = createEffect(
    () => this.actions$.pipe(ofType(verifyForgotPasswordTokenFailed)),
    { dispatch: false },
  );

  newPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(newPassword),
      switchMap(({ payload }) =>
        this.authService.newPassword(payload).pipe(
          map(() => newPasswordSuccess()),
          catchError(() => of(newPasswordFailed({ errorCode: '' }))),
        ),
      ),
    ),
  );

  newPasswordSuccess$ = createEffect(
    () => this.actions$.pipe(ofType(newPasswordSuccess)),
    { dispatch: false },
  );

  newPasswordFailed$ = createEffect(
    () => this.actions$.pipe(ofType(newPasswordFailed)),
    { dispatch: false },
  );
}
