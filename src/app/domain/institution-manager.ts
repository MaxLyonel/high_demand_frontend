// libreries framework
import { Inject, Injectable } from "@angular/core";
// external dependencies
import { Observable } from "rxjs";
// own implementations
import IInstituionDetail from "./ports/i-institution-detail";
import IManagerInstitution, { InstitutionInfo } from "./ports/i-manager-institution";


@Injectable()
export default class InstitutionManager implements IInstituionDetail {

  constructor(@Inject('IManagerInstitution') private _institutionAdapter: IManagerInstitution) {}

  getInfoInstitution(id: number): Observable<InstitutionInfo> {
    const resu = this._institutionAdapter.getInfo(id)
    return resu
  }

}