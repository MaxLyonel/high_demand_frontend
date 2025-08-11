import { Observable } from "rxjs";


export default interface IHighDemand {
  registerHighDemand(obj: any): Observable<any>;
  getHighDemandByInstitution(educationalInstitutionId: number): Observable<any>;
}