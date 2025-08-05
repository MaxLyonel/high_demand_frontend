import { Observable } from "rxjs";

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface AuthenticatedUser {
  id: number;
  username: string;
  token: string;
  roles: string[];
}

export default interface IAuthorizeUser {
  performLogin(credentials: AuthCredentials): Observable<AuthenticatedUser>;
  performLogout(): Observable<void>;
}