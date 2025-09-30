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
    }).pipe( tap((newHighDemand: any) => { })
    )
  }

  sendHighDemand(obj: any): Observable<any> {
    return this.http.post(`high-demand/send`, obj, {
      context: new HttpContext().set(IS_USER_ACTION, true)
    }).pipe(
      catchError(err => {
        console.error("salio mal al enviar la alta demanda")
        return throwError(() => err)
      })
    )
  }

  getHighDemandByInstitution(educationalInstitutionId: number): Observable<any> {
    return this.http.get(`high-demand/${educationalInstitutionId}/by-institution`).pipe(
      tap((highDemand:any) => { })
    )
  }

  getCourse(highDemandId: number): Observable<any> {
    return this.http.get(`high-demand-course/courses/${highDemandId}`).pipe(
      tap(highDemand => {
      })
    )
  }

  updateWorkflowState(obj: any): Observable<any> {
    return this.http.post(`high-demand/udpate-state-worfkflow`, obj, {
      context: new HttpContext().set(IS_USER_ACTION, true)
    }).pipe(
      tap(highDemand => {
      })
    )
  }

  getListInboxHighDemand(rolId: number, stateId: number, placeTypeId: number): Observable<any> {
    const params = new HttpParams()
      .set('rolId', rolId.toString())
      .set('stateId', stateId.toString())
      .set('placeTypeId', placeTypeId.toString())
    return this.http.get(`main-inbox/list-inbox`, { params }).pipe(
      catchError(err => {
        console.error('Algo salió mal', err)
        return throwError(() => err)
      })
    )
  }

  receiveHighDemand(obj: any): Observable<any> {
    return this.http.post(`main-inbox/receive`, obj, {
      context: new HttpContext().set(IS_USER_ACTION, true)
    }).pipe(
      catchError(err => {
        console.error('Salió mal en la recepción', err)
        return throwError(() => err)
      })
    )
  }

  deriveHighDemand(obj: any): Observable<any> {
    return this.http.post(`main-inbox/derive`, obj, {
      context: new HttpContext().set(IS_USER_ACTION, true)
    }).pipe(
      catchError(err => {
        console.error('algo salio mal en la derivacion')
        return throwError(() => err)
      })
    )
  }

  getListReciveHighDemand(rolId: number, placeTypeId: number): Observable<any> {
    const params = new HttpParams()
      .set('rolId', rolId.toString())
      .set('placeTypeId', placeTypeId.toString())
    return this.http.get(`main-inbox/list-receive`, { params }).pipe(
      catchError(err => {
        console.error('error en el listado de recibidos')
        return throwError(() => err)
      })
    )
  }

  getActionFromRoles(rolId: number): Observable<any> {
    return this.http.get(`main-inbox/action-roles/${rolId}`).pipe(
      catchError(err => {
        console.error('error en el listado de acciones')
        return throwError(() => err)
      })
    )
  }

  approveHighDemand(obj: any): Observable<any> {
    return this.http.post(`main-inbox/approve`, obj, {
      context: new HttpContext().set(IS_USER_ACTION, true)
    }).pipe(
      catchError(err => {
        console.error('algo salio mal al aprobar')
        return throwError(() => err)
      })
    )
  }

  declineHighDemand(obj: any): Observable<any> {
    return this.http.post(`main-inbox/decline`, obj, {
      context: new HttpContext().set(IS_USER_ACTION, true)
    }).pipe(
      catchError(err => {
        console.error('algo salio mal al aprobar')
        return throwError(() => err)
      })
    )
  }

  getHighDemands(): Observable<any> {
    return this.http.get(`high-demand/list-high-demands-approved`)
      .pipe(
        catchError(err => {
          console.error('algo salio mal al obtener altas demandas aprobadas')
          return throwError(() => err)
        })
      )
  }

  cancelHighDemand(obj: any): Observable<any> {
    return this.http.post(`high-demand/cancel`, obj, {
      context: new HttpContext().set(IS_USER_ACTION, true)
    }).pipe(
      catchError(err => {
        console.error('Error en cancelar alta demanda')
        return throwError(() => err)
      })
    )
  }

}