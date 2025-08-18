import { Observable } from "rxjs";


export default interface IHighDemand {
  registerHighDemand(obj: any): Observable<any>;
  sendHighDemand(obj:any): Observable<any>;
  receiveHighDemand(obj: any): Observable<any>;
  updateWorkflowState(obj: any): Observable<any>;

  getHighDemandByInstitution(educationalInstitutionId: number): Observable<any>;
  getCoures(highDemandId: number): Observable<any>;
  getListHighDemandByRolState(rolId: number, stateId: number): Observable<any>;
}