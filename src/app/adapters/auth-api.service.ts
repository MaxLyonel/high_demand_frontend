import { BehaviorSubject, map, Observable, of, tap } from "rxjs";
import IAuthorizeUser, { AuthCredentials, AuthenticatedUser } from "../domain/ports/i-authorize-user";
import { HttpClient } from "@angular/common/http";
import IManageAuth from "../domain/ports/i-manage-auth";


export class AuthApiService implements IManageAuth {
  private currentUser$ = new BehaviorSubject<AuthenticatedUser | null>(null);

  constructor(private http: HttpClient) {}

  login(credentials: AuthCredentials): Observable<AuthenticatedUser> {
    return this.http.post<AuthenticatedUser>('/api/auth/login', credentials).pipe(
      tap(user => this.currentUser$.next(user))
    )
  }

  logout(): Observable<void> {
    this.currentUser$.next(null)
    return of(void 0)
  }

  getCurrentUser(): Observable<AuthenticatedUser | null> {
    return this.currentUser$.asObservable()
  }

  isAuthenticated(): Observable<boolean> {
    return this.currentUser$.pipe(
      map(user => user !== null)
    )
  }
}