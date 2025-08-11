import { Observable } from "rxjs";
import { History } from "../models/history.model";



export default interface IManagerHistory {
  getHistories(highDemandRegistationId: number): Observable<History[]>
}