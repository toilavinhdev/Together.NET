import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  getConversation,
  getConversationFailed,
  getConversationSuccess,
  listConversation,
  listConversationFailed,
  listConversationSuccess,
  receivedMessage,
  sendMessage,
  sendMessageFailed,
  sendMessageSuccess,
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
              response,
            }),
          ),
          catchError((err) => of(getConversationFailed())),
        ),
      ),
    ),
  );

  getConversationSuccess$ = createEffect(
    () => this.actions$.pipe(ofType(getConversationSuccess)),
    { dispatch: false },
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

  sendMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(sendMessage),
      tap(() => {
        console.log('send', Date.now());
      }),
      switchMap(({ payload }) =>
        this.messageService.sendMessage(payload).pipe(
          map((data) => sendMessageSuccess({ data })),
          catchError(() => of(sendMessageFailed())),
        ),
      ),
    ),
  );

  sendMessageSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(sendMessageSuccess),
        tap(({ data }) => {
          console.log('send success', Date.now(), data.id);
        }),
      ),
    { dispatch: false },
  );

  sendMessageFailed$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(sendMessageFailed),
        tap(() => {
          this.notificationService.error('Gửi tin nhắn thất bại', '');
        }),
      ),
    { dispatch: false },
  );

  receivedMessage$ = createEffect(
    () => this.actions$.pipe(ofType(receivedMessage)),
    { dispatch: false },
  );
}
