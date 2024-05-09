import { Component, Input, OnInit } from '@angular/core';
import {
  NzModalComponent,
  NzModalContentDirective,
  NzModalService,
} from 'ng-zorro-antd/modal';
import { NzTabComponent, NzTabSetComponent } from 'ng-zorro-antd/tabs';
import { DecimalPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import {
  followListDataSelector,
  IFollowViewModel,
  listFollow,
} from '~shared/features/feature-follow/store';
import { Observable, takeUntil } from 'rxjs';
import { BaseComponent } from '~core/abstractions';

@Component({
  selector: 'together-profile-follows',
  standalone: true,
  imports: [
    NzModalComponent,
    NzModalContentDirective,
    NzTabSetComponent,
    NzTabComponent,
    DecimalPipe,
  ],
  providers: [NzModalService],
  templateUrl: './profile-follows.component.html',
})
export class ProfileFollowsComponent extends BaseComponent implements OnInit {
  @Input() userId = '';
  @Input() totalFollower = 0;
  @Input() totalFollowing = 0;

  visible = false;
  currentTabIndex = 0;

  private pageIndex = 1;
  private readonly PAGE_SIZE = 18;

  follows$: Observable<IFollowViewModel[]> = this.store
    .select(followListDataSelector)
    .pipe(takeUntil(this.destroy$));

  constructor(private store: Store) {
    super();
  }

  private loadData() {
    this.store.dispatch(
      listFollow({
        request: {
          userId: this.userId,
          pageIndex: this.pageIndex,
          pageSize: this.PAGE_SIZE,
          follower: this.currentTabIndex === 0,
        },
      }),
    );
  }

  ngOnInit() {}

  onTabChange(idx: number) {
    this.currentTabIndex = idx;
    this.pageIndex = 1;
    this.loadData();
  }

  openModal(idx: number) {
    this.currentTabIndex = idx;
    this.visible = true;
    this.pageIndex = 1;
    this.loadData();
  }

  handleOk(): void {
    this.visible = false;
  }

  handleCancel(): void {
    this.visible = false;
  }
}
