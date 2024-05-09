import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Store } from '@ngrx/store';
import { logout } from '~features/feature-auth/store';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NzNotificationService);
  const store = inject(Store);

  return next(req).pipe(
    catchError((err) => {
      if ([401].includes(err.status)) {
        notificationService.error('Phiên đăng nhập hết hạn', '');
        store.dispatch(logout());
      }

      return throwError(() => err);
    }),
  );
};
