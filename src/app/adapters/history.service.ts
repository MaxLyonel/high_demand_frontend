import { inject, Injectable } from "@angular/core";
import IManagerHistory from "../domain/ports/i-manager-history";
import { History } from "../domain/models/history.model";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";


@Injectable({ providedIn: 'root'})
export class HistoryAdapterService implements IManagerHistory {

  private http = inject(HttpClient)

  getHistories(highDemandRegistationId: number): Observable<History[]> {
    return this.http.get<any>(`history/list/${highDemandRegistationId}`)
  }

  getGeneralHistories(): Observable<History[]> {
    return this.http.get<any>(`history/list-histories`)
  }

  downloadReportDistrict(districtId: number): Observable<any> {
    return this.http.get(`history/list-high-demands-by-district/${districtId}`, {
      responseType: 'blob'
    })
  }

  donwloadReportDepartment(departmentId: number): Observable<any> {
    return this.http.get(`history/list-high-demands-by-department/${departmentId}`, {
      responseType: 'blob'
    })
  }
}