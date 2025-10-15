import { Observable, take } from "rxjs";
import IHistory from "./ports/i-history";
import { Inject, Injectable } from "@angular/core";
import IManagerHistory from "./ports/i-manager-history";
import { History } from "./models/history.model";

@Injectable()
export class HistoryManager implements IHistory {

  constructor(
    @Inject('IManagerHistory') private _historyAdapter: IManagerHistory
  ) {}

  showList(highDemandRegistrationId: number): Observable<History[]> {
    const entites = this._historyAdapter.getHistories(highDemandRegistrationId)
    return entites
  }

  showGeneralList(): Observable<History[]> {
    const histories = this._historyAdapter.getGeneralHistories()
    return histories
  }

  downloadReportDistrict(districtId: number): Observable<any> {
    const highDemands = this._historyAdapter.downloadReportDistrict(districtId)
    return highDemands
  }

  downloadReportDepartment(departmentId: number): Observable<any> {
    const highDemands = this._historyAdapter.donwloadReportDepartment(departmentId)
    return highDemands
  }
}