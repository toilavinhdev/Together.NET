import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { FollowService } from '~shared/features/feature-follow/store/follow.service';
import {
  follow,
  followFailed,
  followSuccess,
  listFollow,
  listFollowFailed,
  listFollowSuccess,
} from '~shared/features/feature-follow/store/follow.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable()
export class FollowEffects {
  constructor(
    private actions: Actions,
    private followService: FollowService,
    private notificationService: NzNotificationService,
  ) {}

  follow$ = createEffect(() =>
    this.actions.pipe(
      ofType(follow),
      switchMap(({ userId }) =>
        this.followService.follow(userId).pipe(
          map((follow) => followSuccess({ userId, follow })),
          catchError((err: HttpErrorResponse) =>
            of(followFailed({ userId, errorCode: err.error.errors[0].code })),
          ),
        ),
      ),
    ),
  );

  followFailed$ = createEffect(
    () =>
      this.actions.pipe(
        ofType(followFailed),
        tap(({ errorCode }) => {
          this.notificationService.error(
            'Có lỗi xảy ra',
            `Mã lỗi ${errorCode}`,
          );
        }),
      ),
    { dispatch: false },
  );

  listFollow$ = createEffect(() =>
    this.actions.pipe(
      ofType(listFollow),
      switchMap(({ request }) =>
        this.followService.listFollow(request).pipe(
          map((data) =>
            listFollowSuccess({ data, follower: request.follower }),
          ),
          catchError((err: HttpErrorResponse) =>
            of(listFollowFailed({ errorCode: err.error.errors[0].code })),
          ),
        ),
      ),
    ),
  );

  listFollowSuccess$ = createEffect(
    () => this.actions.pipe(ofType(listFollowSuccess)),
    { dispatch: false },
  );

  listFollowFailed$ = createEffect(
    () => this.actions.pipe(ofType(listFollowFailed)),
    { dispatch: false },
  );
}
