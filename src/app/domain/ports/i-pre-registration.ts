import { Observable } from "rxjs";

export default interface IPreRegistration {
  // ** exponer funcionalidad de obtener catálgo de criterios **
  getCriterias(): Observable<any>;
  // ** exponer funcionalidad de obtener catálogo de parentesco **
  getRelationships(): Observable<any>;
  // ** exponer funcionalidad de obtener catálogo de municipios **
  getMunicipies(): Observable<any>;
  // ** exponer funcionalidad para buscar un estudiante por rude **
  searchStudent(sie: number, codeRude: string): Observable<any>;
  // ** exponer funcionalidad para guardar una pre inscripción **
  savePreRegistration(obj: any): Observable<any>;
  // ** exponer funcionalidad para obtener la lista de pre inscripciones **
  getListPreRegistration(): Observable<any>;

}