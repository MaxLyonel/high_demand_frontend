import { HttpClient, HttpContext } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import IManagerHighDemand from "../domain/ports/i-manager-high-demand";
import { Observable, tap } from "rxjs";
import { IS_USER_ACTION } from "../infrastructure/constants/constants";


@Injectable({ providedIn: 'root'})
export class HighDemandAdapterService implements IManagerHighDemand {

  private http = inject(HttpClient);

  saveHighDemand(obj: any): Observable<any> {
    // console.log("Objeto obtenido: ", obj)
    return this.http.post(`high-demand-course/create`, obj, {
      context: new HttpContext().set(IS_USER_ACTION, true)
    }).pipe(
      tap((newHighDemand: any) => {
        // console.log("Se ha creado una institucion como alta demanda", newHighDemand)
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
}