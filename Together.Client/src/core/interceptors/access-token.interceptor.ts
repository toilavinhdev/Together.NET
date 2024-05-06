import { HttpInterceptorFn } from '@angular/common/http';

export const accessTokenInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
