import { catchError, Observable, throwError } from 'rxjs';
import IOperative from './ports/i-operative';
import { Inject, Injectable } from '@angular/core';
import IManagerOperative from './ports/i-manager-operative';


@Injectable()
export default class OperativeManager implements IOperative {

  constructor(
    @Inject('IManagerOperative') private _operativeManager: IManagerOperative
  ) {}

  getOperative(gestionId: number): Observable<any> {
    return this._operativeManager.getOperative(gestionId).pipe(
      catchError(error => {
        console.error("Error durante la obtención del operativo")
        return throwError(() => error)
      })
    )
  }
  saveOperative(obj: any): Observable<any> {
    return this._operativeManager.saveOperative(obj).pipe(
      catchError(error => {
        console.error("Error durante el guardado del operativo")
        return throwError(() => error)
      })
    )
  }

}