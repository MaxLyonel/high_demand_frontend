import { Observable } from "rxjs";

export default interface IPreRegistration {
  // ** exponer funcionalidad de obtener catálgo de criterios **
  getCriterias(): Observable<any>;
  // ** exponer funcionalidad de obtener catálogo de parentesco **
  getRelationships(): Observable<any>;
  // ** exponer funcionalidad de obtener catálogo de municipios **
  getMunicipies(): Observable<any>;
  // ** exponer funcionalidad de obtener catálogo de distritos por departamento **
  getDistrictByDeparment(deparmentId: number): Observable<any>;

  // ** exponer funcionalidad para buscar un estudiante por rude **
  searchStudent(sie: number, codeRude: string): Observable<any>;

  // ** exponer funcionalidad para guardar una pre inscripción **
  savePreRegistration(obj: any): Observable<any>;
  // ** exponer funcionalidad para actualizar una pre inscripción **
  updatePreRegistration(obj: any): Observable<any>;
  // ** exponer funcionalidad para invalidar una pre inscripción **
  invalidatePreRegistration(obj: any): Observable<any>;
  // ** exponer funcionalidad para validar un pre inscripción **
  validatePreRegistration(obj: any): Observable<any>;
  // ** exponer funcionalidad para aceptar una pre inscripción **
  acceptPreRegistrations(obj: any): Observable<any>;



  // ** exponer funcionalidad para obtener la lista de pre inscripciones **
  getListPreRegistration(highDemandId: number): Observable<any>;
  // ** expone funcionalidad para obtener la lista de pre inscripciones validas **
  getListValidPreRegistration(highDemandId: number, levelId: number, gradeId: number): Observable<any>;
  // ** exponer funcionalidad para obtener la lista de pre inscripciones para el seguimiento **
  getListPreRegistrationFollow(identityCardPostulant: string): Observable<any>;

  // ** exponer funcionalidad actualizar estado de la preinscripción **
  updatedStatus(preRegistrationId: number): Observable<any>;
  // ** exopner funcionalidad para obtener la lista de pre inscripciones aceptadas **
  getListAccpeted(): Observable<any>;
  // ** exponer funcionalidad para obtener la lista de niveles **
  getLevels(): Observable<any>;
  // ** exponer funcionalidad para obtener la lista de departamentos **
  getDepartments(): Observable<any>;
  // ** exponer la funcionalidad de buscar información por Código Rude **
  getInfoByCodeRude(codeRude: string): Observable<any>;

  getCounts(courseId: number): Observable<any>;

  // ** exponer funcionalidad para descargar la preinscripción **
  downloadBlob(postulantId: number): Observable<any>;
  downloadBlobWithHeaders(id: number): Observable<any>;
  downloadReportByCourse(highDemandId: number, levelId: number, gradeId: number): Observable<any>;

}