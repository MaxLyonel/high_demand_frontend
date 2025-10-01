import { Observable } from "rxjs";


export default interface IHighDemand {
  registerHighDemand(obj: any): Observable<any>;
  sendHighDemand(obj: any): Observable<any>;
  receiveHighDemands(obj: any): Observable<any>;
  deriveHighDemand(obj: any): Observable<any>;
  approveHighDemand(obj: any): Observable<any>;
  declineHighDeamand(obj: any): Observable<any>;
  // ** exponer la funcionalidad de anular alta demanda **
  cancelHighDemand(obj: any): Observable<any>;
  updateWorkflowState(obj: any): Observable<any>;
  getActionFromRoles(rolId: number): Observable<any>;

  getHighDemandByInstitution(educationalInstitutionId: number): Observable<any>;
  getCoures(highDemandId: number): Observable<any>;
  getListInbox(rolId: number, stateId: number, placeTypeId: number): Observable<any>;
  getListReceive(rolId: number, placeTypeId: number): Observable<any>;

  // para la pre inscripción
  getHighDemands(departmentId: number): Observable<any>;
}