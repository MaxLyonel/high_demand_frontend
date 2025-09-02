import { Observable } from "rxjs";



export default interface IManagerOperative {
  getOperative(gestionId: number): Observable<any>
  saveOperative(obj: any): Observable<any>
}