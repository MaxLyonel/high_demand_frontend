import { Observable } from "rxjs";



export default interface IPermission {
  getActions(): Observable<any>;
  getResources(): Observable<any>;
  createPermission(obj: any): Observable<any>;
  getOperators(): Observable<any>;
  getFields(): Observable<any>;
  changePermissionStatus(obj: any): Observable<any>
}