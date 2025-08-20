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

}