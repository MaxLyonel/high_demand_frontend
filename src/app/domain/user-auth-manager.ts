import { inject, Injectable } from "@angular/core";
import IAuthorizeUser, { AuthCredentials, AuthenticatedUser } from "./ports/i-authorize-user";
import { BehaviorSubject, map, Observable, of, tap } from "rxjs";
import { HttpClient } from "@angular/common/http";
import IManageAuth from "./ports/i-manage-auth";



@Injectable()
export default class UserAuthManager implements IAuthorizeUser {
  // private currentUser$ = new BehaviorSubject<AuthenticatedUser | null>(null);

  // constructor(private http: HttpClient) {}
  // private _userAuthManager = inject<IManageAuth>('IManageAuth');


  performLogin(credentials: AuthCredentials): Observable<AuthenticatedUser> {
    throw new Error("Method not implemented.");
  }
  performLogout(): Observable<void> {
    throw new Error("Method not implemented.");
  }

}