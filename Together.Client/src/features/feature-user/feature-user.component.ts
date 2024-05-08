import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { NavigationEnd, Router } from '@angular/router';
import { BaseComponent } from '~core/abstractions';
import { combineLatest, filter, map, Observable, takeUntil } from 'rxjs';
import {
  getProfile,
  IGetProfileResponse,
  userProfileDataSelector,
  userProfileErrorSelector,
  userProfileStatusSelector,
} from '~features/feature-user/store';
import { ProfileComponent } from '~features/feature-user/components/profile/profile.component';
import { StatusType } from '~core/types';
import { AsyncPipe } from '@angular/common';
import { authMeSelector, IGetMeResponse } from '~features/feature-auth/store';

@Component({
  selector: 'together-feature-user',
  standalone: true,
  imports: [ProfileComponent, AsyncPipe],
  templateUrl: './feature-user.component.html',
  styles: ``,
})
export class FeatureUserComponent extends BaseComponent implements OnInit {
  username = '';
  me$: Observable<IGetMeResponse | null> = this.store
    .select(authMeSelector)
    .pipe(takeUntil(this.destroy$));
  profile$: Observable<IGetProfileResponse | null> = this.store
    .select(userProfileDataSelector)
    .pipe(takeUntil(this.destroy$));
  status$: Observable<StatusType> = this.store
    .select(userProfileStatusSelector)
    .pipe(takeUntil(this.destroy$));
  error$: Observable<string | null> = this.store
    .select(userProfileErrorSelector)
    .pipe(takeUntil(this.destroy$));
  isMe$: Observable<boolean> = combineLatest([this.me$, this.profile$]).pipe(
    takeUntil(this.destroy$),
    map(([me, profile]) => {
      if (me && profile) {
        return me.id === profile.id;
      }
      return false;
    }),
  );

  constructor(
    private store: Store,
    private router: Router,
  ) {
    super();
  }

  ngOnInit() {
    this.username = this.router.url.split('/')[2];
    this.getProfile();
    this.router.events
      .pipe(
        takeUntil(this.destroy$),
        filter((event) => event instanceof NavigationEnd),
      )
      .subscribe((event: any) => {
        this.username = event.url.split('/')[2];
        this.getProfile();
      });
  }

  private getProfile() {
    this.store.dispatch(getProfile({ username: this.username }));
  }
}
