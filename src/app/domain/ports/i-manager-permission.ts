import { Observable } from "rxjs"

export default interface IManagerPermission {
  getActions(): Observable<any>
  getResources(): Observable<any>
  sendToSave(obj: any): Observable<any>
  getOperators(): Observable<any>
  getFields(): Observable<any>
  changePermissionStatus(obj: any): Observable<any>
}