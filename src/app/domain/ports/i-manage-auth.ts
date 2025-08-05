import { Observable } from "rxjs";
import { AuthCredentials, AuthenticatedUser } from "./i-authorize-user";






export default interface IManageAuth {

  login(credentials: AuthCredentials): Observable<AuthenticatedUser>;
  logout(): Observable<void>;
  getCurrentUser(): Observable<AuthenticatedUser | null>;
  isAuthenticated(): Observable<boolean>;

}