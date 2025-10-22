import { Observable } from "rxjs";



export default interface IManagerPreRegistration {
  // ** obtener catálogo de criterios **
  getCriterias(): Observable<any>;
  // ** obtener catálogo de parentesco **
  getRelationships(): Observable<any>;
  // ** obtener catálogo de municipios **
  getMunicipies(): Observable<any>;
  // ** obtener catálogo de distritos por departamento **
  getDistrictByDepartment(departmentId: number): Observable<any>;

  // ** buscar un estudiante por su código rude **
  searchStudent(sie: number, codeRude: string): Observable<any>;

  // ** guardar una pre inscripción **
  savePreRegistration(obj: any): Observable<any>;
  // ** invalidar una pre inscripción **
  invalidatePreRegistration(obj: any): Observable<any>;
  // ** validar una pre inscripción **
  validatePreRegistration(obj: any): Observable<any>;
  // ** aceptar pre inscripciones **
  acceptPreRegistrations(obj: any): Observable<any>;

  // ** obtener lista de pre inscripciones **
  getListPreRegistrations(highDemandId: number): Observable<any>;
  // ** obtener lista de pre inscripciones validas **
  getListValidPreRegistrations(highDemandId: number): Observable<any>;
  // ** obtener lista de pre isncripciones para el seguimiento **
  getListPreRegistrationFollow(identityCardPostulant: string): Observable<any>;

  // ** Actualizar el estado de la pre inscripción **
  updatedStatus(preRegistrationId: number): Observable<any>
  // ** obtener lista de pre inscripciones aceptadas **
  getListAccepted(): Observable<any>
  // ** obtener lista de niveles **
  getListLevels(): Observable<any>
  // ** obtener lista de departamentos **
  getListDepartments(): Observable<any>;
  // ** obtener información de estudiante por Código Rude **
  getInfoByCodeRude(codeRude: string): Observable<any>;

  // ** descargar la preinscripción **
  download(postulantId: number): Observable<any>;

}