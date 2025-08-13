import { Observable, tap } from "rxjs";
import IManagerRol from "../domain/ports/i-manager-rol";
import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AppStore } from "../infrastructure/store/app.store";


@Injectable({ providedIn: 'root'})
export class RolAdapterService implements IManagerRol {

  private readonly http = inject(HttpClient)
  private appStore = inject(AppStore)

  getRoles(): Observable<any> {
    return this.http.get('/roles').pipe(
      tap((roles: any) => {
      })
    )
  }
  getRolActive(): Observable<any> {
    throw new Error("Method not implemented.");
  }

}