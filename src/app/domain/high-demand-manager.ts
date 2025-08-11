import { Observable } from "rxjs";
import IHighDemand from "./ports/i-high-demand";
import { Inject, Injectable } from "@angular/core";
import IManagerHighDemand from "./ports/i-manager-high-demand";




@Injectable()
export default class HighDemandManager implements IHighDemand {

  constructor(
    @Inject('IManagerHighDemand') private _highDemandAdapter: IManagerHighDemand
  ) {}

  registerHighDemand(obj: any): Observable<any> {
    const result = this._highDemandAdapter.saveHighDemand(obj)
    return result
  }

  getHighDemandByInstitution(educationalInstitutionId: number): Observable<any> {
    const result = this._highDemandAdapter.getHighDemandByInstitution(educationalInstitutionId)
    return result
  }
}