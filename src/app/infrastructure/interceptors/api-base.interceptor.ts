import { HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { inject } from '@angular/core';
import { LocalStorageService } from '../services/local-storage.service';
import { NotificationService } from '../services/notify.service';
import { IS_USER_ACTION } from '../constants/constants';
import { AppStore } from '../store/app.store';

export function apiBaseInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {

  const localStorageService = inject(LocalStorageService);
  const notificationService = inject(NotificationService);
  const appStore = inject(AppStore)

  const { user, institutionInfo } = appStore.snapshot
  const selectedRoleId = user?.selectedRole?.role?.id
  const institutionId = institutionInfo?.id
  const placeTypeId = user?.selectedRole?.placeType?.id

  let apiReq = req.clone({
    headers: req.headers.set(
      'Authorization',
      `Bearer ${localStorageService.getToken()}`
    ),
    url: req.url.startsWith('http')
      ? req.url
      : `${environment.apiUrl}/${req.url}`
  });

  if(selectedRoleId) {
    apiReq = apiReq.clone({
      headers: apiReq.headers.set('x-selected-role-id', selectedRoleId.toString())
    })
  }

  if(institutionId) {
    apiReq = apiReq.clone({
      headers: apiReq.headers.set('x-institution-id', institutionId.toString())
    })
  }

  if(placeTypeId) {
    apiReq = apiReq.clone({
      headers: apiReq.headers.set('x-place-type-id', placeTypeId.toString())
    })
  }

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
