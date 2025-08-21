import { Inject, Injectable } from "@angular/core";
import { catchError, map, Observable, tap, throwError } from "rxjs";

import IAuthorizeUser, { AuthCredentials, AuthenticatedUser } from "./ports/i-authorize-user";
import IManagerAuth from "./ports/i-manager-auth";



@Injectable()
export default class UserAuthManager implements IAuthorizeUser {

  user: AuthenticatedUser | undefined = undefined;

  constructor(
    @Inject('IManagerAuth') private _userAuthManager: IManagerAuth
  ) {}

  performLogin(credentials: AuthCredentials): Observable<AuthenticatedUser> {
    return this._userAuthManager.login(credentials).pipe(
      tap((user: AuthenticatedUser) => {
      }),
      map((user: AuthenticatedUser) => {
        this.user = user;
        return user;
      }),
      catchError(error => {
        console.error("Error durante el login:", error);
        return throwError(() => error); // se puede reemplazar con of(null)
      })
    );
  }

  performLogout(): Observable<void> {
    throw new Error("Method not implemented.");
  }

}