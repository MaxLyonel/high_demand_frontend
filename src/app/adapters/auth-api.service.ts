// framework angular
import { inject, Injectable } from "@angular/core";
import { HttpClient, HttpContext } from "@angular/common/http";
import { map, Observable, of, tap } from "rxjs";
// own implementations
import IManagerAuth from "../domain/ports/i-manager-auth";
import { AuthCredentials, AuthenticatedUser } from "../domain/ports/i-authorize-user";
import { LocalStorageService } from "../infrastructure/services/local-storage.service";
import { IS_USER_ACTION } from "../infrastructure/constants/constants";
import { AppStore } from "../infrastructure/store/app.store";
import { UserDataService } from '../infrastructure/services/user-data.service';


@Injectable({ providedIn: 'root'})
export class AuthAdapterService implements IManagerAuth {

  private appStore = inject(AppStore);
  private http     = inject(HttpClient);
  private localStorageService = inject(LocalStorageService);


  login(credentials: AuthCredentials): Observable<AuthenticatedUser> {
    return this.http.post<AuthenticatedUser>('auth/login', credentials, {
      context: new HttpContext().set(IS_USER_ACTION, true)
    }).pipe(
      tap((user: any) => {
        const token = user.access_token;
        this.localStorageService.authTokenStore(token);
        const decodedUser = this.localStorageService.decodeUser(token);
        this.localStorageService.userStore(decodedUser); //TODO: eliminar
        this.appStore.setUser(decodedUser);

      })
    )
  }

  logout(): Observable<void> {
    this.localStorageService.clear()
    this.appStore.clear()
    return of(void 0)
  }

  getCurrentUser(): Observable<AuthenticatedUser | null> {
    return this.appStore.state$.pipe(
      map(state => state.user)
    )
  }

  isAuthenticated(): Observable<boolean> {
    return this.getCurrentUser().pipe(
      map(user => user !== null)
    )
  }
}