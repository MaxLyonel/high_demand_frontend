import { inject, Injectable } from "@angular/core";
import IManagerPermission from "../domain/ports/i-manager-permission";
import { catchError, Observable, throwError } from "rxjs";
import { HttpClient, HttpContext } from "@angular/common/http";
import { IS_USER_ACTION } from "../infrastructure/constants/constants";


@Injectable({ providedIn: 'root'})
export class PermissionAdapterService implements IManagerPermission {

  private readonly http = inject(HttpClient)

  getActions(): Observable<any> {
    return this.http.get('permission/actions').pipe(
      catchError(err => {
        console.error("Error al obtener las acciones")
        return throwError(() => err)
      })
    )
  }

  getResources(): Observable<any> {
    return this.http.get('permission/resources').pipe(
      catchError(err => {
        console.error("Error al obtener los recursos")
        return throwError(() => err)
      })
    )
  }

  sendToSave(obj: any): Observable<any> {
    return this.http.post('permission/create', obj, {
      context: new HttpContext().set(IS_USER_ACTION, true)
    }).pipe(
      catchError(err => {
        console.error("Error al guardar el permiso", err)
        return throwError(() => err)
      })
    )
  }

  getOperators(): Observable<any> {
    return this.http.get(`permission/operators`).pipe(
      catchError(err => {
        console.error("Error al obtener los operadores")
        return throwError(() => err)
      })
    )
  }

  getFields(): Observable<any> {
    return this.http.get(`permission/fields`).pipe(
      catchError(err => {
        console.error("Error al obtener los campos")
        return throwError(() => err)
      })
    )
  }

  changePermissionStatus(obj: any): Observable<any> {
    return this.http.post('permission/change-active', obj, {
      context: new HttpContext().set(IS_USER_ACTION, true)
    }).pipe(
      catchError(err => {
        console.error("Error al actualizar el permiso")
        return throwError(() => err)
      })
    )
  }
}