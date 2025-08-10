import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root'})
export class LocalStorageService {

  authTokenStore(token: string): void {
    localStorage.setItem('auth_token', token)
  }

  decodeUser(token: string) {
    const [header, payload, signature] = token.split('.');
    const decodedPayload = JSON.parse(
      atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    );
    return decodedPayload;
  }

  userStore(user: string): void {
    localStorage.setItem('user', JSON.stringify(user))
  }

  getToken(): string | null {
    const token = localStorage.getItem('auth_token')
    return token
  }

  getUser() {
    const authUser = localStorage.getItem('user')
    if(authUser) {
      const user = JSON.parse(authUser)
      return user
    }
    return null
  }
}