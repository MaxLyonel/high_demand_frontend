import { Inject, Injectable } from "@angular/core";
import IManagerPermission from "./ports/i-manager-permission";
import IPermission from "./ports/i-permission";
import { catchError, Observable, throwError } from "rxjs";


@Injectable()
export default class PermissionManager implements IPermission {

  constructor(
    @Inject('IManagerPermission') private _permissionManager: IManagerPermission
  ){}

  getActions(): Observable<any> {
    return this._permissionManager.getActions().pipe(
      catchError(error => {
        console.error("Error durante la obtención de acciones")
        return throwError(() => error)
      })
    )
  }
  getResources(): Observable<any> {
    return this._permissionManager.getResources().pipe(
      catchError(error => {
        console.error("Error durante la obtención de recursos")
        return throwError(() => error)
      })
    )
  }

  createPermission(obj: any): Observable<any> {
    return this._permissionManager.sendToSave(obj).pipe(
      catchError(error => {
        console.error("Error durante la creación del permiso")
        return throwError(() => error)
      })
    )
  }

  updatePermission(obj: any): Observable<any> {
    return this._permissionManager.sendToUpdate(obj).pipe(
      catchError(error => {
        console.error("Error durante la actualización")
        return throwError(() => error)
      })
    )
  }

  getOperators(): Observable<any> {
    return this._permissionManager.getOperators().pipe(
      catchError(error => {
        console.error("Error durante la obtención de operadores")
        return throwError(() => error)
      })
    )
  }

  getFields(): Observable<any> {
    return this._permissionManager.getFields().pipe(
      catchError(error => {
        console.error("Error al obtener campos")
        return throwError(() => error)
      })
    )
  }

  changePermissionStatus(obj: any): Observable<any> {
    return this._permissionManager.changePermissionStatus(obj).pipe(
      catchError(error => {
        console.error("Error al actualizar el permiso")
        return throwError(() => error)
      })
    )
  }

  getPermissions(): Observable<any> {
    return this._permissionManager.getPermissions().pipe(
      catchError(error => {
        console.error("Error al obtener los permisos")
        return throwError(() => error)
      })
    )
  }
}