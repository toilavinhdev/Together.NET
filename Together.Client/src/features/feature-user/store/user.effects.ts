import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserService } from '~features/feature-user/store/user.service';
import {
  getProfile,
  getProfileFailed,
  getProfileSuccess,
  me,
  meFailed,
  meSuccess,
  updateProfile,
  updateProfileFailed,
  updateProfileSuccess,
} from '~features/feature-user/store/user.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { LoadingService } from '~shared/services';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private userService: UserService,
    private notificationService: NzNotificationService,
    private loadingService: LoadingService,
  ) {}

  me$ = createEffect(() =>
    this.actions$.pipe(
      ofType(me),
      tap(() => {
        this.loadingService.showGlobalLoading();
      }),
      switchMap(() =>
        this.userService.me().pipe(
          map((response) => meSuccess({ response })),
          catchError(() => of(meFailed())),
        ),
      ),
      tap(() => {
        this.loadingService.hideGlobalLoading();
      }),
    ),
  );

  getProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getProfile),
      switchMap(({ username }) =>
        this.userService.profile(username).pipe(
          map((profile) => getProfileSuccess({ profile })),
          catchError((err: HttpErrorResponse) => {
            return of(
              getProfileFailed({
                errorCode: err.error.errors[0].code,
              }),
            );
          }),
        ),
      ),
    ),
  );

  updateProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateProfile),
      switchMap(({ payload }) =>
        this.userService.updateProfile(payload).pipe(
          map(() => updateProfileSuccess({ payload })),
          catchError((err: HttpErrorResponse) =>
            of(updateProfileFailed({ errorCode: err.error.errors?.[0].code })),
          ),
        ),
      ),
    ),
  );

  updateSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updateProfileSuccess),
        tap(() => {
          this.notificationService.success('Cập nhật thành công', '');
        }),
      ),
    { dispatch: false },
  );

  updateFailed$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updateProfileFailed),
        tap(() => {
          this.notificationService.error('Cập nhật thất bại', '');
        }),
      ),
    { dispatch: false },
  );
}
