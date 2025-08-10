import { BehaviorSubject, map, Observable, of, tap } from "rxjs";
import { HttpClient, HttpContext } from "@angular/common/http";
import IManagerAuth from "../domain/ports/i-manager-auth";
import { AuthCredentials, AuthenticatedUser } from "../domain/ports/i-authorize-user";
import { inject, Injectable } from "@angular/core";
import { LocalStorageService } from "../infrastructure/services/local-storage.service";
import { IS_USER_ACTION } from "../infrastructure/constants/constants";


@Injectable({ providedIn: 'root'})
export class AuthAdapterService implements IManagerAuth {
  private currentUser$ = new BehaviorSubject<AuthenticatedUser | null>(null);

  private http = inject(HttpClient);
  private localStorageService = inject(LocalStorageService)

  constructor() {
    const storedUser = this.localStorageService.getUser() as any;
    this.currentUser$.next(storedUser);
  }

  login(credentials: AuthCredentials): Observable<AuthenticatedUser> {
    return this.http.post<AuthenticatedUser>('auth/login', credentials, {
      context: new HttpContext().set(IS_USER_ACTION, true)
    }).pipe(
      tap((user: any) => {
        const token = user.access_token
        this.localStorageService.authTokenStore(token)
        const decodedUser = this.localStorageService.decodeUser(token)
        this.localStorageService.userStore(decodedUser)
        this.currentUser$.next(decodedUser)
      })
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