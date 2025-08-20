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
}