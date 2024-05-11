import { Component, Input, OnInit } from '@angular/core';
import {
  NzModalComponent,
  NzModalContentDirective,
  NzModalService,
} from 'ng-zorro-antd/modal';
import { NzTabComponent, NzTabSetComponent } from 'ng-zorro-antd/tabs';
import { AsyncPipe, DecimalPipe, NgTemplateOutlet } from '@angular/common';
import { Store } from '@ngrx/store';
import { BaseComponent } from '~core/abstractions';
import {
  CdkVirtualForOf,
  CdkVirtualScrollViewport,
  ScrollingModule,
} from '@angular/cdk/scrolling';
import { UserAvatarComponent } from '~shared/components';
import { BtnFollowComponent } from '~shared/features/feature-follow/components/btn-follow/btn-follow.component';
import { Observable, take, takeUntil } from 'rxjs';
import {
  FollowEffects,
  followersSelector,
  followingsSelector,
  followListStatusSelector,
  IListFollowResponse,
  listFollow,
} from '~shared/features/feature-follow/store';
import { NzSkeletonComponent } from 'ng-zorro-antd/skeleton';
import { ScrollEndReachDirective } from '~shared/directives';
import { StatusType } from '~core/types';
import { Router, RouterLink } from '@angular/router';
import { userMeSelector } from '~features/feature-user/store';

@Component({
  selector: 'together-profile-follows',
  standalone: true,
  imports: [
    NzModalComponent,
    NzModalContentDirective,
    NzTabSetComponent,
    NzTabComponent,
    DecimalPipe,
    CdkVirtualForOf,
    CdkVirtualScrollViewport,
    AsyncPipe,
    ScrollingModule,
    UserAvatarComponent,
    BtnFollowComponent,
    NgTemplateOutlet,
    NzSkeletonComponent,
    ScrollEndReachDirective,
    RouterLink,
  ],
  providers: [NzModalService],
  templateUrl: './profile-follows.component.html',
})
export class ProfileFollowsComponent extends BaseComponent implements OnInit {
  @Input() userId = '';
  @Input() totalFollower = 0;
  @Input() totalFollowing = 0;

  meId = '';

  visible = false;
  currentTabIndex = 0;

  private currentPageIndex = 0;
  private readonly PAGE_SIZE = 24;
  hasNextPage = true;

  followers$!: Observable<IListFollowResponse>;
  followings$!: Observable<IListFollowResponse>;

  status: StatusType = 'idle';
  private _status$: Observable<StatusType> = this.store
    .select(followListStatusSelector)
    .pipe(takeUntil(this.destroy$));

  constructor(
    private store: Store,
    private router: Router,
    private followEffects: FollowEffects,
  ) {
    super();
  }

  ngOnInit() {
    this._status$.subscribe((s) => {
      this.status = s;
    });

    this.store
      .select(userMeSelector)
      .pipe(takeUntil(this.destroy$), take(1))
      .subscribe((data) => {
        if (data) {
          this.meId = data.id;
        }
      });

    this.followers$ = this.store
      .select(followersSelector)
      .pipe(takeUntil(this.destroy$));
    this.followings$ = this.store
      .select(followingsSelector)
      .pipe(takeUntil(this.destroy$));

    this.followEffects.listFollowSuccess$
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ data }) => {
        this.hasNextPage = data.pagination.hasNextPage;
      });
  }

  openModal(idx: number) {
    this.currentTabIndex = idx;
    this.visible = true;
    this.currentPageIndex = 0;
    this.hasNextPage = true;
    this.loadData();
  }

  handleOk(): void {
    this.visible = false;
  }

  handleCancel(): void {
    this.visible = false;
    this.currentPageIndex = 0;
    this.hasNextPage = true;
  }

  onEndReach() {
    this.loadData();
  }

  private loadData() {
    if (this.status === 'loading' || !this.hasNextPage) return;
    this.store.dispatch(
      listFollow({
        request: {
          follower: this.currentTabIndex === 0,
          userId: this.userId,
          pageIndex: ++this.currentPageIndex,
          pageSize: this.PAGE_SIZE,
        },
      }),
    );
  }

  navigateToProfile(username: string) {
    const path = '/profile/' + username;
    this.router.navigate([path]).then(() => {
      this.handleCancel();
    });
  }
}
