import { inject, Injectable } from "@angular/core";
import IManagerOperative from "../domain/ports/i-manager-operative";
import { catchError, Observable, throwError } from "rxjs";
import { HttpClient, HttpContext } from "@angular/common/http";
import { IS_USER_ACTION } from "../infrastructure/constants/constants";

@Injectable()
export class OperativeAdapterService implements IManagerOperative {

  private http = inject(HttpClient)

  getOperative(gestionId: number): Observable<any> {
    gestionId = new Date().getFullYear()
    return this.http.get(`operative/${gestionId}`).pipe(
      catchError(err => {
        console.error("Error al obtener el operativo")
        return throwError(() => err)
      })
    )
  }

  saveOperative(obj: any): Observable<any> {
    return this.http.post(`operative/create`, obj, {
      context: new HttpContext().set(IS_USER_ACTION, true)
    }).pipe(
      catchError(err => {
        console.error("Error al guardar el operativo")
        return throwError(() => err)
      })
    )
  }

}