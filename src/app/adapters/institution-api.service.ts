import { inject, Injectable } from "@angular/core";
import IManagerInstitution, { InstitutionInfo } from "../domain/ports/i-manager-institution";
import { catchError, Observable, tap, throwError } from "rxjs";
import { HttpClient } from "@angular/common/http";




@Injectable({ providedIn: 'root'})
export class InstitutionAdapterService implements IManagerInstitution {

  private http = inject(HttpClient);

  getInfo(id: number): Observable<InstitutionInfo> {
    return this.http.get<InstitutionInfo>(`educational-institution/info/${id}`).pipe(
      tap(res => console.log("backend datos: ", res )),
      catchError(err => {
        return throwError(() => err); // relanza el error
      })
    )
  }

}