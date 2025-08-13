import { Observable } from "rxjs";





export default interface IManagerRol {
  getRoles(): Observable<any>;
  getRolActive(): Observable<any>;
}