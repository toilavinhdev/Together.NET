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
import { catchError, map, of, switchMap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class FollowEffects {
  constructor(
    private actions: Actions,
    private followService: FollowService,
  ) {}

  follow$ = createEffect(() =>
    this.actions.pipe(
      ofType(follow),
      switchMap(({ userId }) =>
        this.followService.follow(userId).pipe(
          map((follow) => followSuccess({ userId, follow })),
          catchError((err: HttpErrorResponse) =>
            of(followFailed({ errorCode: err.error.errors[0].code })),
          ),
        ),
      ),
    ),
  );

  listFollow$ = createEffect(() =>
    this.actions.pipe(
      ofType(listFollow),
      switchMap(({ request }) =>
        this.followService.listFollow(request).pipe(
          map((data) => listFollowSuccess({ data })),
          catchError((err: HttpErrorResponse) =>
            of(listFollowFailed({ errorCode: err.error.errors[0].code })),
          ),
        ),
      ),
    ),
  );
}
