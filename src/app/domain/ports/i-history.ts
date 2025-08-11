import { Observable } from "rxjs";
import { History } from "../models/history.model";


export default interface IHistory {
  showList(highDemandRegistrationId: number): Observable<History[]>
}