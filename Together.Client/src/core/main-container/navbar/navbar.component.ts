import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { SvgIconComponent } from '~shared/components';
import {
  NzDropDownDirective,
  NzDropdownMenuComponent,
} from 'ng-zorro-antd/dropdown';
import {
  NzMenuDirective,
  NzMenuDividerDirective,
  NzMenuItemComponent,
} from 'ng-zorro-antd/menu';
import { Store } from '@ngrx/store';
import { logout } from '~features/feature-auth/store';
import { filter, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { IGetMeResponse, userMeSelector } from '~features/feature-user/store';

@Component({
  selector: 'together-navbar',
  standalone: true,
  imports: [
    RouterLink,
    SvgIconComponent,
    NzDropDownDirective,
    NzDropdownMenuComponent,
    NzMenuDirective,
    NzMenuItemComponent,
    NzMenuDividerDirective,
    AsyncPipe,
  ],
  templateUrl: './navbar.component.html',
  styles: ``,
})
export class NavbarComponent implements OnInit {
  me$: Observable<IGetMeResponse | null> = this.store.select(userMeSelector);
  currentPath = '';
  currentUsername = '';

  constructor(
    private store: Store,
    private router: Router,
  ) {}

  ngOnInit() {
    this.currentPath = this.router.url;
    this.currentUsername = this.router.url.includes('/profile')
      ? this.router.url.split('/')[2]
      : '';
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentPath = event.url;
        this.currentUsername = event.url.includes('/profile')
          ? event.url.split('/')[2]
          : '';
      });
  }

  onLogout() {
    this.store.dispatch(logout());
  }

  isActive(path: string): boolean {
    if (this.router.url.includes(path) && path.includes('/inbox')) return true;
    return this.router.url == path;
  }

  getIcon(path: string, icon: string, iconFilled: string): string {
    return this.isActive(path) ? iconFilled : icon;
  }
}
