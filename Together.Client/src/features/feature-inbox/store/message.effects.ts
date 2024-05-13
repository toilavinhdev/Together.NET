import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  getConversation,
  getConversationFailed,
  getConversationSuccess,
  listConversation,
  listConversationFailed,
  listConversationSuccess,
} from '~features/feature-inbox/store/message.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { MessageService } from '~features/feature-inbox/store/message.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable()
export class MessageEffects {
  constructor(
    private actions$: Actions,
    private messageService: MessageService,
    private notificationService: NzNotificationService,
  ) {}

  listConversation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(listConversation),
      switchMap(({ params }) =>
        this.messageService.listConversation(params).pipe(
          map((response) => listConversationSuccess({ response })),
          catchError((err) => of(listConversationFailed())),
        ),
      ),
    ),
  );

  listConversationFailed$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(listConversationFailed),
        tap(() => {
          this.notificationService.error(
            'Có lỗi xảy ra',
            'Tải danh sách tin nhắn thất bại',
          );
        }),
      ),
    { dispatch: false },
  );

  getConversation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getConversation),
      switchMap(({ params }) =>
        this.messageService.getConversation(params).pipe(
          map((response) =>
            getConversationSuccess({
              conversationId: params.conversationId,
              response,
            }),
          ),
          catchError((err) => of(getConversationFailed())),
        ),
      ),
    ),
  );

  getConversationFailed$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(getConversationFailed),
        tap(() => {
          this.notificationService.error(
            'Có lỗi xảy ra',
            'Tải tin nhắn thất bại',
          );
        }),
      ),
    { dispatch: false },
  );
}
