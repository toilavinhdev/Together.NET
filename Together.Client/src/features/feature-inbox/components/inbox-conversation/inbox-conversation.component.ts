import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs';
import { BaseComponent } from '~core/abstractions';
import { Store } from '@ngrx/store';
import { getConversation } from '~features/feature-inbox/store';

@Component({
  selector: 'together-inbox-conversation',
  standalone: true,
  imports: [],
  templateUrl: './inbox-conversation.component.html',
  styles: ``,
})
export class InboxConversationComponent
  extends BaseComponent
  implements OnInit
{
  conversationId = '';
  currentPageIndex = 1;
  private readonly PAGE_SIZE = 24;

  constructor(
    private route: ActivatedRoute,
    private store: Store,
  ) {
    super();
  }

  ngOnInit() {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((paramMap) => {
      this.conversationId = paramMap.get('id')!;
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
}
