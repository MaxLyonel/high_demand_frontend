import { Observable } from "rxjs";
import { InstitutionInfo } from "../models/institution-info.model";



export default interface IManagerInstitution {

  getInfo(id: number): Observable<InstitutionInfo>;
  consolidate(id: number): Observable<any>;
  verifyConsolidate(id: number): Observable<any>;

}