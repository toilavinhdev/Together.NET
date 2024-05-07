import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '~features/feature-auth/store';

export const accessTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const accessToken = authService.getAccessToken();

  return accessToken
    ? next(
        req.clone({
          setHeaders: {
            Authorization: `Bearer ${accessToken} `,
          },
        }),
      )
    : next(req);
};
