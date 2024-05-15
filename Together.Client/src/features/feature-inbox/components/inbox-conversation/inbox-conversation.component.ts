import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { merge, Observable, take, takeUntil } from 'rxjs';
import { BaseComponent } from '~core/abstractions';
import { Store } from '@ngrx/store';
import {
  getConversation,
  IMessageViewModel,
  messageConversationSelector,
  MessageEffects,
} from '~features/feature-inbox/store';
import { AsyncPipe, NgForOf } from '@angular/common';
import {
  CdkFixedSizeVirtualScroll,
  CdkVirtualScrollViewport,
} from '@angular/cdk/scrolling';
import { UserAvatarComponent } from '~shared/components';
import { InboxTypingMessageComponent } from '~features/feature-inbox/components/inbox-typing-message/inbox-typing-message.component';
import { userMeSelector } from '~features/feature-user/store';

@Component({
  selector: 'together-inbox-conversation',
  standalone: true,
  imports: [
    AsyncPipe,
    CdkVirtualScrollViewport,
    CdkFixedSizeVirtualScroll,
    NgForOf,
    UserAvatarComponent,
    InboxTypingMessageComponent,
  ],
  templateUrl: './inbox-conversation.component.html',
  styles: ``,
})
export class InboxConversationComponent
  extends BaseComponent
  implements OnInit, AfterViewInit
{
  currentUserId = '';

  @ViewChild('cdkVirtualScrollViewport')
  virtualScrollViewPort!: CdkVirtualScrollViewport;

  conversationId = '';
  currentPageIndex = 1;
  private readonly PAGE_SIZE = 24;

  conversation$: Observable<
    { conversationId: string; messages: IMessageViewModel[] } | undefined
  > = this.store
    .select(messageConversationSelector)
    .pipe(takeUntil(this.destroy$));

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private cdk: ChangeDetectorRef,
    private messageEffects: MessageEffects,
  ) {
    super();
  }

  ngOnInit() {
    this.getCurrentUserId();
    this.routerTracking();
    this.subscribeEffects();
  }

  private getCurrentUserId() {
    this.store
      .select(userMeSelector)
      .pipe(take(1))
      .subscribe((data) => {
        this.currentUserId = data?.id ?? '';
      });
  }

  private routerTracking() {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((paramMap) => {
      this.conversationId = paramMap.get('conversationId')!;
      this.cdk.detectChanges();
      this.currentPageIndex = 1;
      this.store.dispatch(
        getConversation({
          params: {
            conversationId: this.conversationId,
            pageIndex: this.currentPageIndex,
            pageSize: this.PAGE_SIZE,
          },
        }),
      );
    });
  }

  private subscribeEffects() {
    merge(
      this.messageEffects.getConversationSuccess$,
      this.messageEffects.sendMessageSuccess$,
      this.messageEffects.receivedMessage$,
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ type }) => {
        this.scrollToBottom();
      });
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  private scrollToBottom() {
    setTimeout(() => {
      this.virtualScrollViewPort.scrollTo({ bottom: 0 });
    }, 10);
  }
}
