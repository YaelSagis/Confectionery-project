import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { API_BASE } from './config';
import { AuthService } from './services/auth.service';
import { ToastService } from './services/ui.services';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).token();
  if (!token || !req.url.startsWith(API_BASE)) return next(req);
  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const isLogin = req.url.endsWith('/Auth/login');
      if (err.status === 401 && !isLogin) {
        auth.logout();
        toast.error('נדרשת התחברות כדי לצפות בתוכן הזה');
        router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
      } else if (err.status === 0) {
        toast.error('אין חיבור לשרת. ודאו שפרויקט Clean.API רץ');
      } else if (!isLogin) {
        toast.error(`הפעולה נכשלה (${err.status}). נסו שוב בעוד רגע`);
      }
      return throwError(() => err);
    }),
  );
};

export const authGuard: CanActivateFn = (_route, state) => {
  if (inject(AuthService).isLoggedIn()) return true;
  return inject(Router).createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
