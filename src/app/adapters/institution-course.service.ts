import { inject, Injectable } from "@angular/core";
import { IManagerInstitutionCourse } from "../domain/ports/i-manager-institution-course";
import { catchError, Observable, throwError, tap } from "rxjs";
import { Level } from "../domain/models/course.model";
import { HttpClient, HttpParams } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class InstitutionCourseAdapterService implements IManagerInstitutionCourse {

  private http = inject(HttpClient);

  getCourses(sie: number, gestionId: number): Observable<Level[]> {
    const params = new HttpParams()
      .set('sie', sie.toString())
      .set('gestionTypeId', gestionId.toString());

    return this.http.get<Level[]>(`educational-institution-course/course-structure`, { params }).pipe(
      tap(res => console.log("Backend datos cursos: ", res)),
      catchError(err => {
        console.error("Algo salió mal", err);
        return throwError(() => err);
      })
    );
  }
}
