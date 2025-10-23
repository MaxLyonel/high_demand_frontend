import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import IManagerTeacher from "../domain/ports/i-manager-teacher";
import { catchError, Observable, tap, throwError } from "rxjs";
import { Teacher } from "../domain/models/teacher.model";
import { APP_CONSTANTS } from "../infrastructure/constants/constants";


@Injectable({ providedIn: 'root'})
export class TeacherAdapterService implements IManagerTeacher {

  private http = inject(HttpClient)

  getInfoTeacher(personId: number): Observable<Teacher> {
    const params = new HttpParams()
      .set('personId', personId)
      .set('gestionId', APP_CONSTANTS.CURRENT_YEAR) //TODO

    return this.http.get<Teacher>(`auth/info-teacher`, { params }).pipe(
      catchError(err => {
        console.error("Error al obtener informacion de maestro", err)
        return throwError(() => err)
      })
    )
  }


}