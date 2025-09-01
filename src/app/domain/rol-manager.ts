import { catchError, Observable, throwError } from "rxjs";
import { Rol } from "./models/rol.model";
import IRoles from "./ports/i-roles";
import { Inject, Injectable } from "@angular/core";
import IManagerRol from "./ports/i-manager-rol";




@Injectable()
export default class RolManager implements IRoles {

  constructor(
    @Inject('IManagerRol') private _rolManager: IManagerRol
  ){}

  showRoles(): Observable<Rol[]> {
    return this._rolManager.getRoles().pipe(
      catchError(error => {
        console.error("Error durante la obtencion de roles", error)
        return throwError(() => error)
      })
    )
  }
}