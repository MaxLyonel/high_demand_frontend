import { Observable } from "rxjs";




export default interface IManagerHighDemand {
  saveHighDemand(obj: any): Observable<any>
  getHighDemandByInstitution(educationalInstitutionId: number): Observable<any>;
}