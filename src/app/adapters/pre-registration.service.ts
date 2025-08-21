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
        console.log("Error al obtener el catálogo de criterio")
        return throwError(() => err)
      })
    )
  }

  getRelationships(): Observable<any> {
    return this.http.get(`catalogs/list-relationship`).pipe(
      tap((catalogs:any) => {
      }),
      catchError(err => {
        console.log("Error al obtener el catalogo de parentescos")
        return throwError(() => err)
      })
    )
  }

  getMunicipies(): Observable<any> {
    return this.http.get(`catalogs/list-municipies`).pipe(
      tap((catalogs: any) => {
      }),
      catchError(err => {
        console.log("Error al obtener el catálogo de municipios")
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
        console.error("Algo salió mal en buscar estudiante: ", err)
        return throwError(() => err)
      })
    )

  }

  savePreRegistration(obj: any): Observable<any> {
    return this.http.post(`pre-registration/create`, obj, {
      context: new HttpContext().set(IS_USER_ACTION, true)
    }).pipe(
      catchError(err => {
        console.log("Error al crear una pre inscripción")
        return throwError(() => err)
      })
    )
  }

  getListPreRegistrations(): Observable<any> {
    return this.http.get(`pre-registration/list`).pipe(
      catchError(err => {
        console.log("Error al obtener la lista de pre inscripciones")
        return throwError(() => err)
      })
    )
  }

}