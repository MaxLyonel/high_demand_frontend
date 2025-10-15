import { Observable } from "rxjs";
import { History } from "../models/history.model";


export default interface IHistory {
  showList(highDemandRegistrationId: number): Observable<History[]>
  showGeneralList(): Observable<History[]>
  downloadReportDistrict(districtId: number): Observable<any>;
  downloadReportDepartment(departmentId: number): Observable<any>;
}