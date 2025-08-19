import { Observable } from "rxjs";




export default interface IManagerHighDemand {
  // ** guardar alta demanda **
  saveHighDemand(obj: any): Observable<any>
  // ** enviar alta demanda **
  sendHighDemand(obj: any): Observable<any>;
  // ** recepcionar alta demanda **
  receiveHighDemand(obj: any): Observable<any>;
  // ** derivar alta demanda **
  deriveHighDemand(obj: any): Observable<any>;
  // ** aprobar alta demanda **
  approveHighDemand(obj: any): Observable<any>;
  // ** rechazar alta demanda **
  declineHighDemand(obj: any): Observable<any>;
  // ** listar altas demandas en inbox
  getListHighDemand(rolId: number, stateId: number): Observable<any>;
  // ** listar altas demandas recibidos
  getListReciveHighDemand(rolId: number): Observable<any>;
  // ** obtener acciones del rol **
  getActionFromRoles(rolId: number): Observable<any>;

  getHighDemandByInstitution(educationalInstitutionId: number): Observable<any>;
  getCourse(highDemandId: number): Observable<any>
  updateWorkflowState(obj: any): Observable<any>;

  // ** obtener Altas Demandas para la pre-inscripción **
  getHighDemands(): Observable<any>;
}