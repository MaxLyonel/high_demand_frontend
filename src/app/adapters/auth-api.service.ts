import { BehaviorSubject, map, Observable, of, tap } from "rxjs";
import { HttpClient } from "@angular/common/http";
import IManagerAuth from "../domain/ports/i-manager-auth";
import { AuthCredentials, AuthenticatedUser } from "../domain/ports/i-authorize-user";
import { inject, Injectable } from "@angular/core";


@Injectable({ providedIn: 'root'})
export class AuthAdapterService implements IManagerAuth {
  private currentUser$ = new BehaviorSubject<AuthenticatedUser | null>(null);

  private http = inject(HttpClient);

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