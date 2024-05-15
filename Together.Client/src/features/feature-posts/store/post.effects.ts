import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PostService } from '~features/feature-posts/store/post.service';
import {
  newPost,
  newPostFailed,
  newPostSuccess,
  reply,
  replyFailed,
  replySuccess,
} from '~features/feature-posts/store/post.actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable()
export class PostEffects {
  constructor(
    private actions$: Actions,
    private postService: PostService,
    private notificationService: NzNotificationService,
  ) {}

  newPost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(newPost),
      switchMap(({ payload }) =>
        this.postService.newPost(payload).pipe(
          map((response) => newPostSuccess({ response })),
          catchError(() => of(newPostFailed())),
        ),
      ),
    ),
  );

  newPostSuccess$ = createEffect(
    () => this.actions$.pipe(ofType(newPostSuccess)),
    { dispatch: false },
  );

  newPostFailed$ = createEffect(
    () => this.actions$.pipe(ofType(newPostFailed)),
    { dispatch: false },
  );

  reply$ = createEffect(() =>
    this.actions$.pipe(
      ofType(reply),
      switchMap(({ payload }) =>
        this.postService.reply(payload).pipe(
          map((response) => replySuccess({ response })),
          catchError(() => of(replyFailed())),
        ),
      ),
    ),
  );

  replySuccess$ = createEffect(() => this.actions$.pipe(ofType(replySuccess)), {
    dispatch: false,
  });

  replyFailed$ = createEffect(() => this.actions$.pipe(ofType(replyFailed)), {
    dispatch: false,
  });
}
