import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '~core/abstractions';
import { filter, Observable, takeUntil } from 'rxjs';
import {
  IConversationViewModel,
  listConversation,
  messageConversationsSelector,
} from '~features/feature-inbox/store';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { UserAvatarComponent } from '~shared/components';
import { NavigationEnd, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'together-inbox-recent-conversations',
  standalone: true,
  imports: [AsyncPipe, ScrollingModule, UserAvatarComponent, RouterLink],
  templateUrl: './inbox-recent-conversations.component.html',
  styles: ``,
})
export class InboxRecentConversationsComponent
  extends BaseComponent
  implements OnInit
{
  private currentPageIndex = 1;
  private readonly PAGE_SIZE = 24;

  selectedConversationId = '';

  conversations: Observable<IConversationViewModel[]> = this.store
    .select(messageConversationsSelector)
    .pipe(takeUntil(this.destroy$));

  constructor(
    private store: Store,
    private router: Router,
  ) {
    super();
  }

  ngOnInit() {
    this.selectedConversationId = this.router.url.split('/')[2];
    this.router.events
      .pipe(
        takeUntil(this.destroy$),
        filter((event) => event instanceof NavigationEnd),
      )
      .subscribe((event: any) => {
        this.selectedConversationId = event.url.split('/')[2];
      });
    this.store.dispatch(
      listConversation({
        params: {
          pageIndex: this.currentPageIndex,
          pageSize: this.PAGE_SIZE,
        },
      }),
    );
  }
}
