import { Observable } from "rxjs";




export default interface IManagerHighDemand {
  // ** guardar alta demanda **
  saveHighDemand(obj: any): Observable<any>
  // ** enviar alta demanda **
  sendHighDemand(obj: any): Observable<any>;
  // ** recepcionar alta demanda **
  receiveHighDemand(obj: any): Observable<any>;
  getHighDemandByInstitution(educationalInstitutionId: number): Observable<any>;
  getCourse(highDemandId: number): Observable<any>
  updateWorkflowState(obj: any): Observable<any>;
  getListHighDemand(rolId: number, stateId: number): Observable<any>;
}