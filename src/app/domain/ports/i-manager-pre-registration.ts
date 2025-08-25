import { Observable } from "rxjs";



export default interface IManagerPreRegistration {
  // ** obtener catálogo de criterios **
  getCriterias(): Observable<any>;
  // ** obtener catálogo de parentesco **
  getRelationships(): Observable<any>;
  // ** obtener catálogo de municipios **
  getMunicipies(): Observable<any>;
  // ** buscar un estudiante por su código rude **
  searchStudent(sie: number, codeRude: string): Observable<any>;
  // ** guardar una pre inscripción **
  savePreRegistration(obj: any): Observable<any>;
  // ** obtener lista de pre inscripciones **
  getListPreRegistrations(): Observable<any>
  // ** Actualizar el estado de la pre inscripción **
  updatedStatus(preRegistrationId: number): Observable<any>
  // ** obtener lista de pre inscripciones aceptadas **
  getListAccepted(): Observable<any>

}