import { Observable } from "rxjs";
import { InstitutionInfo } from "../models/institution-info.model";




export default interface IInstituionDetail {

  getInfoInstitution(id: number): Observable<InstitutionInfo>;
}