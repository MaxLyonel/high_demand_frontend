import { Observable } from "rxjs";




export default interface IManagerHighDemand {
  saveHighDemand(obj: any): Observable<any>
  getHighDemandByInstitution(educationalInstitutionId: number): Observable<any>;
  getCourse(highDemandId: number): Observable<any>
  updateWorkflowState(obj: any): Observable<any>;
  getListHighDemand(rolId: number, stateId: number): Observable<any>;
  receiveHighDemand(obj: any): Observable<any>;
}