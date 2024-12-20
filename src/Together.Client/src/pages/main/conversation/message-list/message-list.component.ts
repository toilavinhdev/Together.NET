import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BaseComponent } from '@/core/abstractions';
import { ActivatedRoute } from '@angular/router';
import { filter, take, takeUntil, tap } from 'rxjs';
import {
  CloudinaryService,
  ConversationService,
  MessageService,
  UserService,
  WebSocketService,
} from '@/shared/services';
import { IListMessageRequest } from '@/shared/entities/message.entities';
import { getErrorMessage, isUrl, scrollToBottom } from '@/shared/utilities';
import {
  AvatarComponent,
  EmojiPickerComponent,
} from '@/shared/components/elements';
import { TooltipModule } from 'primeng/tooltip';
import { TimeAgoPipe } from '@/shared/pipes';
import { Button } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AsyncPipe, NgIf } from '@angular/common';
import { EConversationType } from '@/shared/enums';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { websocketClientTarget } from '@/shared/constants';
import { ScrollReachedDirective } from '@/shared/directives';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'together-message-list',
  standalone: true,
  imports: [
    AvatarComponent,
    TooltipModule,
    TimeAgoPipe,
    Button,
    InputTextModule,
    NgIf,
    ReactiveFormsModule,
    AsyncPipe,
    ScrollReachedDirective,
    EmojiPickerComponent,
    ImageModule,
  ],
  templateUrl: './message-list.component.html',
})
export class MessageListComponent
  extends BaseComponent
  implements OnInit, AfterViewChecked
{
  @ViewChild('messageTextEditor', { static: true }) messageTextEditorElement:
    | ElementRef
    | undefined;

  @ViewChild('audio') audio!: ElementRef<HTMLAudioElement>;

  protected readonly EConversationType = EConversationType;

  extra: { [key: string]: any } = {};

  params: IListMessageRequest = {
    conversationId: '',
    pageIndex: 1,
    pageSize: 24,
  };

  messageForm!: UntypedFormGroup;

  loading = false;

  loadingSendMessage = false;

  hasNextPage = false;

  // fix animate scroll bottom when init conversation: opacity = 0
  scrolledBottom = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    private formBuilder: UntypedFormBuilder,
    protected userService: UserService,
    private conversationService: ConversationService,
    private webSocketService: WebSocketService,
    private cloudinaryService: CloudinaryService,
  ) {
    super();
  }

  ngOnInit() {
    this.buildForm();
    this.activatedRoute.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((paramMap) => {
        this.params.conversationId = paramMap.get('conversationId')!;
        this.params.pageIndex = 1;
        this.scrolledBottom = false;
        this.extra = {};
        this.loadMessages();
      });
    this.listenWebSocket();
  }

  ngAfterViewChecked() {}

  onSelectEmoji(emoji: string) {
    const message = `${this.messageForm.get('text')?.value ?? ''}${emoji}`;
    this.messageForm.get('text')?.setValue(message);
  }

  private loadMessages() {
    this.loading = true;
    this.messageService
      .listMessage(this.params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ result, extra, pagination }) => {
          this.loading = false;
          this.extra = extra;
          this.hasNextPage = pagination.hasNextPage;
          // infinite scroll
          if (pagination.pageIndex === 1) {
            this.messageService.messages$.next(result.reverse());
          } else {
            const beginScrollHeight =
              document.getElementById('messages-container')!.scrollHeight;
            this.messageService.messages$
              .pipe(take(1))
              .subscribe((messages) => {
                this.messageService.messages$.next([
                  ...result.reverse(),
                  ...messages,
                ]);
              });
            // fix scroll height = 0 when added messages to top
            setTimeout(() => {
              const container = document.getElementById('messages-container')!;
              const afterScrollHeight = container.scrollHeight;
              container.scrollTo({
                top: afterScrollHeight - beginScrollHeight,
                behavior: 'instant',
              });
            });
          }
          if (pagination.pageIndex === 1) {
            setTimeout(() => {
              scrollToBottom('messages-container');
              this.scrolledBottom = true;
            });
          }
        },
        error: (err) => {
          this.loading = false;
          this.commonService.toast$.next({
            type: 'error',
            message: getErrorMessage(err),
          });
        },
      });
  }

  private buildForm() {
    this.messageForm = this.formBuilder.group({
      text: [null, [Validators.required]],
    });
  }

  onScrollReachedTop() {
    if (!this.hasNextPage) return;
    ++this.params.pageIndex;
    this.loadMessages();
  }

  onSendMessage() {
    if (this.messageForm.invalid) return;
    this.loadingSendMessage = true;
    this.messageService
      .sendMessage({
        ...this.messageForm.value,
        conversationId: this.params.conversationId,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.loadingSendMessage = false;
          this.messageForm.reset();
          this.userService.me$.pipe(take(1)).subscribe((me) => {
            if (!me) return;
            // Update messages
            this.messageService.messages$
              .pipe(take(1))
              .subscribe((messages) => {
                this.messageService.messages$.next([
                  ...messages,
                  {
                    ...data,
                    createdById: me.id,
                    createdByUserName: me.userName,
                    createdByAvatar: me.avatar,
                  },
                ]);
                setTimeout(() => {
                  scrollToBottom('messages-container', 'smooth');
                  this.scrolledBottom = true;
                });
              });
            // Update conversations
            this.conversationService.conversations$
              .pipe(take(1))
              .subscribe((conversations) => {
                const existed = conversations.find(
                  (c) => c.id == this.params.conversationId,
                );
                if (!existed) {
                } else {
                  this.conversationService.conversations$.next([
                    {
                      ...existed,
                      lastMessageAt: data.createdAt,
                      lastMessageByUserId: me.id,
                      lastMessageByUserName: me.userName,
                      lastMessageText: data.text,
                    },
                    ...conversations.filter(
                      (c) => c.id !== this.params.conversationId,
                    ),
                  ]);
                }
              });
          });
        },
        error: (err) => {
          this.loadingSendMessage = false;
          this.commonService.toast$.next({
            type: 'error',
            message: getErrorMessage(err),
          });
        },
      });
  }

  private listenWebSocket() {
    this.webSocketService.client$
      .pipe(
        takeUntil(this.destroy$),
        filter(
          (message) => message.target === websocketClientTarget.ReceivedMessage,
        ),
        tap(() => {}),
      )
      .subscribe({
        next: (socket) => {
          if (socket.message.conversationId !== this.params.conversationId) {
            this.commonService.playAudio('notification');
            return;
          }
          // add message
          this.extra['userOnline'] = true;
          this.messageService.messages$.pipe(take(1)).subscribe((messages) => {
            this.messageService.messages$.next([
              ...messages,
              {
                ...socket.message,
                createdById: socket.message.createdById,
                createdByUserName: socket.message.createdByUserName,
                createdByAvatar: socket.message.createdByAvatar,
              },
            ]);
            setTimeout(() => {
              scrollToBottom('messages-container', 'smooth');
              this.scrolledBottom = true;
            });
          });
        },
      });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.loadingSendMessage = true;
    this.cloudinaryService
      .uploadImage(file)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ url }) => {
          this.messageForm.get('text')?.setValue(url);
          this.onSendMessage();
        },
        error: () => {
          this.commonService.toast$.next({
            type: 'error',
            message: 'Upload ảnh không thành công',
          });
        },
      });
  }

  protected readonly isUrl = isUrl;
}
