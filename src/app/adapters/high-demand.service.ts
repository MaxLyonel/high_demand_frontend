import { HttpClient, HttpContext, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import IManagerHighDemand from "../domain/ports/i-manager-high-demand";
import { catchError, Observable, of, tap, throwError } from "rxjs";
import { IS_USER_ACTION } from "../infrastructure/constants/constants";


@Injectable({ providedIn: 'root'})
export class HighDemandAdapterService implements IManagerHighDemand {

  private http = inject(HttpClient);

  saveHighDemand(obj: any): Observable<any> {
    return this.http.post(`high-demand/create`, obj, {
      context: new HttpContext().set(IS_USER_ACTION, true)
    }).pipe(
      tap((newHighDemand: any) => {
        // console.log("Se ha creado una institucion como alta demanda", newHighDemand)
      })
    )
  }

  sendHighDemand(obj: any): Observable<any> {
    return this.http.post(`high-demand/send`, obj, {
      context: new HttpContext().set(IS_USER_ACTION, true)
    }).pipe(
      catchError(err => {
        console.log("salio mal al enviar la alta demanda")
        return throwError(() => err)
      })
    )
  }

  getHighDemandByInstitution(educationalInstitutionId: number): Observable<any> {
    return this.http.get(`high-demand/${educationalInstitutionId}/by-institution`).pipe(
      tap((highDemand:any) => {
        // console.log("Se ha obtenido datos de la alta demanda", highDemand)
      })
    )
  }

  getCourse(highDemandId: number): Observable<any> {
    return this.http.get(`high-demand-course/courses/${highDemandId}`).pipe(
      tap(highDemand => {
        // console.log("Se ha obtenido cursos de la alta demanda", highDemand)
      })
    )
  }

  updateWorkflowState(obj: any): Observable<any> {
    return this.http.post(`high-demand/udpate-state-worfkflow`, obj, {
      context: new HttpContext().set(IS_USER_ACTION, true)
    }).pipe(
      tap(highDemand => {
        // console.log("Se ha actualizado el estado del flujo", highDemand)
      })
    )
  }

  getListHighDemand(rolId: number, stateId: number): Observable<any> {
    const params = new HttpParams()
      .set('rolId', rolId.toString())
      .set('stateId', stateId.toString())
    return this.http.get(`high-demand/list-by-state-rol`, { params }).pipe(
      catchError(err => {
        console.error('Algo salió mal', err)
        return throwError(() => err)
      })
    )
  }

  receiveHighDemand(id: number): Observable<any> {
    return this.http.get(`high-demand/${id}/receive`, {
      context: new HttpContext().set(IS_USER_ACTION, true)
    }).pipe(
      catchError(err => {
        console.error('Salió mal en la recepción', err)
        return throwError(() => err)
      })
    )
  }

  deriveHighDemand(obj: any): Observable<any> {
    console.log("objeto a enviar: ", obj)
    return this.http.post(`high-demand/derive`, obj, {
      context: new HttpContext().set(IS_USER_ACTION, true)
    }).pipe(
      catchError(err => {
        console.error('algo salio mal en la derivacion')
        return throwError(() => err)
      })
    )
  }

  getListReciveHighDemand(rolId: number): Observable<any> {
    const params = new HttpParams()
      .set('rolId', rolId.toString())
    return this.http.get(`high-demand/list-receive`, { params }).pipe(
      catchError(err => {
        console.error('error en el listado de recibidos')
        return throwError(() => err)
      })
    )
  }

  getActionFromRoles(rolId: number): Observable<any> {
    return this.http.get(`high-demand/action-roles/${rolId}`).pipe(
      catchError(err => {
        console.error('error en el listado de acciones')
        return throwError(() => err)
      })
    )
  }

}