import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/enviornment';

export function apiBaseInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const apiReq = req.clone({
    url: req.url.startsWith('http') ? req.url : `${environment.apiUrl}/${req.url}`
  });
  return next(apiReq);
}