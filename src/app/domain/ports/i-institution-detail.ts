import { Observable } from "rxjs";
import { InstitutionInfo } from "./i-manager-institution";





export default interface IInstituionDetail {

  getInfoInstitution(id: number): Observable<InstitutionInfo>;
}