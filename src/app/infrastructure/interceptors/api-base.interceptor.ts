import { HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
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

  const localStorageService = inject(LocalStorageService);
  const notificationService = inject(NotificationService);

  const apiReq = req.clone({
    headers: req.headers.append(
      'Authorization',
      `Bearer ${localStorageService.getToken()}`
    ),
    url: req.url.startsWith('http')
      ? req.url
      : `${environment.apiUrl}/${req.url}`
  });

  return next(apiReq).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        const isUserAction = req.context.get(IS_USER_ACTION);
        if (isUserAction) {
          const message = (event.body as any)?.message || 'Operación realizada con éxito';

          switch (event.status) {
            case 200:
            case 201:
              notificationService.showMessage(message, 'Éxito', 'success');
              break;
            case 204:
              notificationService.showMessage('Sin contenido', 'Información', 'info');
              break;
            default:
              notificationService.showMessage(message, 'Info', 'info');
              break;
          }
        }
      }
    }),
    catchError((error: HttpErrorResponse) => {
      const isUserAction = req.context.get(IS_USER_ACTION);
      if (isUserAction) {
        let type: 'error' | 'warning' | 'info' = 'error';
        let title = 'Error';
        let message = error?.error?.message || error?.message || 'Ocurrió un error inesperado';

        switch (error.status) {
          case 400:
            type = 'warning';
            title = 'Solicitud inválida';
            break;
          case 401:
            type = 'warning';
            title = 'No autorizado';
            break;
          case 403:
            type = 'error';
            title = 'Prohibido';
            break;
          case 404:
            type = 'info';
            title = 'No encontrado';
            break;
          case 500:
            type = 'error';
            title = 'Error interno';
            break;
        }

        notificationService.showMessage(message, title, type);
      }
      return throwError(() => error);
    })
  );
}
