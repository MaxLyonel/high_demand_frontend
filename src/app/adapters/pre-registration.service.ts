import { inject, Injectable } from "@angular/core";
import IManagerPreRegistration from "../domain/ports/i-manager-pre-registration";
import { HttpClient, HttpContext, HttpParams } from "@angular/common/http";
import { catchError, Observable, tap, throwError } from "rxjs";
import { IS_USER_ACTION } from "../infrastructure/constants/constants";



@Injectable({ providedIn: 'root'})
export class PreRegistrationAdapterService implements IManagerPreRegistration {

  private http = inject(HttpClient)

  getCriterias(): Observable<any> {
    return this.http.get(`catalogs/list-criterias`).pipe(
      tap((catalogs:any) => {
      }),
      catchError(err => {
        console.error("Error al obtener el catálogo de criterio")
        return throwError(() => err)
      })
    )
  }

  getRelationships(): Observable<any> {
    return this.http.get(`catalogs/list-relationship`).pipe(
      tap((catalogs:any) => {
      }),
      catchError(err => {
        console.error("Error al obtener el catalogo de parentescos")
        return throwError(() => err)
      })
    )
  }

  getMunicipies(): Observable<any> {
    return this.http.get(`catalogs/list-municipies`).pipe(
      tap((catalogs: any) => {
      }),
      catchError(err => {
        console.error("Error al obtener el catálogo de municipios")
        return throwError(() => err)
      })
    )
  }

  searchStudent(sie: number, codeRude: string): Observable<any> {
    const params = new HttpParams()
      .set('sie', sie.toString())
      .set('codeRude', codeRude.toString())
    return this.http.get(`catalogs/search-student`, {
      params,
      context: new HttpContext().set(IS_USER_ACTION, true)
    }).pipe(
      catchError(err => {
        console.error("Algo salió mal en buscar estudiante")
        return throwError(() => err)
      })
    )

  }

  getInfoByCodeRude(codeRude: string): Observable<any> {
    return this.http.get(`catalogs/search-student/${codeRude}`, {
      context: new HttpContext().set(IS_USER_ACTION, true)
    }).pipe(
      catchError(err => {
        console.error("algo salió mal en buscar estudiante")
        return throwError(() => err)
      })
    )
  }

  savePreRegistration(obj: any): Observable<any> {
    return this.http.post(`pre-registration/create`, obj, {
      context: new HttpContext().set(IS_USER_ACTION, true)
    }).pipe(
      catchError(err => {
        console.error("Error al crear una pre inscripción")
        return throwError(() => err)
      })
    )
  }

  invalidatePreRegistration(obj: any): Observable<any> {
    return this.http.post(`pre-registration/invalidate`, obj, {
      context: new HttpContext().set(IS_USER_ACTION, true)
    }).pipe(
      catchError(err => {
        console.error("Error al invalidar una pre inscripción")
        return throwError(() => err)
      })
    )
  }

  validatePreRegistration(obj: any): Observable<any> {
    return this.http.post(`pre-registration/validate`, obj, {
      context: new HttpContext().set(IS_USER_ACTION, true)
    }).pipe(
      catchError(err => {
        console.error("Error al validar la pre inscripción")
        return throwError(() => err)
      })
    )
  }

  acceptPreRegistrations(obj: any): Observable<any> {
    return this.http.post(`pre-registration/accept-chosen`, obj, {
      context: new HttpContext().set(IS_USER_ACTION, true)
    }).pipe(
      catchError(err => {
        console.error("Error al aceptar preinscripciones")
        return throwError(() => err)
      })
    )
  }


  getListPreRegistrations(highDemandId: number): Observable<any> {
    return this.http.get(`pre-registration/list/${highDemandId}`).pipe(
      catchError(err => {
        console.error("Error al obtener la lista de pre inscripciones")
        return throwError(() => err)
      })
    )
  }

  getListValidPreRegistrations(highDemandId: number, levelId: number, gradeId: number): Observable<any> {
    const params = new HttpParams()
      .set('highDemandId', highDemandId.toString())
      .set('levelId', levelId.toString())
      .set('gradeId', gradeId.toString())
    return this.http.get(`pre-registration/list-valid`, { params }).pipe(
      catchError(err => {
        console.error("Error al obtener el listado de pre inscripciones válidas")
        return throwError(() => err)
      })
    )
  }

  getListPreRegistrationFollow(identityCardPostulant: string): Observable<any> {
    return this.http.get(`pre-registration/list-follow/${identityCardPostulant}`, {
      context: new HttpContext().set(IS_USER_ACTION, true)
    }).pipe(
      catchError(err => {
        console.error("Error al obtener pre inscripciones para el seguimiento")
        return throwError(() => err)
      })
    )
  }

  updatedStatus(preRegistrationId: number): Observable<any> {
    return this.http.get(`pre-registration/update-status/${preRegistrationId}`).pipe(
      catchError(err => {
        console.error("Error al actualizar el estado de la preinscripción")
        return throwError(() => err)
      })
    )
  }

  getListAccepted(): Observable<any> {
    return this.http.get(`pre-registration/accepted-list`).pipe(
      catchError(err => {
        console.error("Error al obtener pre inscripciones aceptadas")
        return throwError(() => err)
      })
    )
  }

  getListLevels(): Observable<any> {
    return this.http.get(`catalogs/list-levels`).pipe(
      catchError(err => {
        console.error("Error al obtener niveles")
        return throwError(() => err)
      })
    )
  }

  getListDepartments(): Observable<any> {
    return this.http.get(`catalogs/list-departments`).pipe(
      catchError(err => {
        console.error("Error al obtener departamentos")
        return throwError(() => err)
      })
    )
  }

  download(postulantId: number): Observable<Blob> {
    return this.http.get(`pre-registration/print/${postulantId}`, {
      responseType: 'blob'
    })
  }

  getDistrictByDepartment(departmentId: number): Observable<any> {
    return this.http.get(`catalogs/list-districts-by-departement/${departmentId}`).pipe(
      catchError(err => {
        console.error("Error al obtener el catálogo de criterio")
        return throwError(() => err)
      })
    )
  }

}