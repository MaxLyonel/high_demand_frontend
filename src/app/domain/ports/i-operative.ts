import { Observable } from "rxjs";



export default interface IOperative {
  getOperative(gestionId: number): Observable<any>;
  saveOperative(obj: any): Observable<any>
}