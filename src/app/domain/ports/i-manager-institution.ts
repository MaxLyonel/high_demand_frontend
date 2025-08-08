import { Observable } from "rxjs";
import { InstitutionInfo } from "../models/institution-info.model";



export default interface IManagerInstitution {

  getInfo(id: number): Observable<InstitutionInfo>;

}