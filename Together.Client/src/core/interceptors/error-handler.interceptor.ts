import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { CommonService } from '~shared/services';
import { NzNotificationService } from 'ng-zorro-antd/notification';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const commonService = inject(CommonService);
  const notificationService = inject(NzNotificationService);

  return next(req).pipe(
    catchError((err, caught) => {
      if ([401].includes(err.status)) {
        console.log('UNAUTHORIZED');
        notificationService.error('Phiên đăng nhập hết hạn', '');
        commonService.redirectToLogin();
      }

      return throwError(() => err);
    }),
  );
};
