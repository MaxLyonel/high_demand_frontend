import { HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/enviornment';
import { inject } from '@angular/core';
import { LocalStorageService } from '../services/local-storage.service';
import { NotificationService } from '../services/notify.service';
import { IS_USER_ACTION } from '../constants/constants';

export function apiBaseInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {

  const localStorageService = inject(LocalStorageService)
  const notificationService = inject(NotificationService);

  const apiReq = req.clone({
    headers: req.headers.append('Authorization', `Bearer ${localStorageService.getToken()}`),
    url: req.url.startsWith('http') ? req.url : `${environment.apiUrl}/${req.url}`
  });


  return next(apiReq).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        const isUserAction = req.context.get(IS_USER_ACTION)
        if(isUserAction) {
          const message = (event.body as any)?.message;
          if (message) {
            notificationService.showMessage(message, 'Mensaje del servidor', 'info');
          } else {
            notificationService.showMessage('Mensaje del servidor99', 'Mensaje del servidor', 'success');
          }
        }
      }
    }),
    catchError((error) => {
      const isUserAction = req.context.get(IS_USER_ACTION);
      if (isUserAction) {
        // Extraer mensaje del backend o usar uno genérico
        const errorMessage =
          error?.error?.message || error?.message || 'Ocurrió un error inesperado';
        notificationService.error(errorMessage, 'Error del servidor');
      }
      // notificationService.error('Error interceptor', 'Error del servidor');
      return throwError(() => error);
    })
  );
}