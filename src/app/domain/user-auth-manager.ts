import { Inject, inject, Injectable } from "@angular/core";
import IAuthorizeUser, { AuthCredentials, AuthenticatedUser } from "./ports/i-authorize-user";
import { BehaviorSubject, catchError, map, Observable, of, tap } from "rxjs";
import { HttpClient } from "@angular/common/http";
import IManageAuth from "./ports/i-manager-auth";
import IManagerAuth from "./ports/i-manager-auth";
import { User } from './models/user';



@Injectable()
export default class UserAuthManager implements IAuthorizeUser {

  user: User | undefined = undefined;
  // private currentUser$ = new BehaviorSubject<AuthenticatedUser | null>(null);

  // constructor(private http: HttpClient) {}
  // private _userAuthManager = inject<IManageAuth>('IManageAuth');
  constructor(
    @Inject('IManagerAuth') private _userAuthManager: IManagerAuth
  ) {}


  performLogin(credentials: AuthCredentials): Observable<AuthenticatedUser> {
    return this._userAuthManager.login(credentials).pipe(
      tap (_ => console.log("Inicio de sesión exitoso")),
      map(user => { this.user = user})
    )
  }
  performLogout(): Observable<void> {
    throw new Error("Method not implemented.");
  }

}