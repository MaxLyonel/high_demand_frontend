import { Observable, of } from "rxjs";
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

  getCoures(highDemandId: number): Observable<any> {
    const result = this._highDemandAdapter.getCourse(highDemandId)
    return result
  }

  updateWorkflowState(obj: any): Observable<any> {
    const result = this._highDemandAdapter.updateWorkflowState(obj)
    return result
  }

  getListInbox(rolId: number, placeTypeId: number): Observable<any> {
    const result = this._highDemandAdapter.getListInboxHighDemand(rolId, placeTypeId)
    return result
  }

  getListReceive(rolId: number, placeTypeId: number): Observable<any> {
    const result = this._highDemandAdapter.getListReciveHighDemand(rolId, placeTypeId)
    return result
  }

  getListInboxDepartment(rolId: number, stateId: number, placeTypeId: number): Observable<any> {
    throw new Error("método no implementado")
  }

  getListReceiveDepartment(rolId: number, placeTypeId: number): Observable<any> {
    throw new Error("método no implementado")
  }

  receiveHighDemands(obj: any): Observable<any> {
    const result = this._highDemandAdapter.receiveHighDemand(obj)
    return result
  }

  sendHighDemand(obj: any): Observable<any> {
    const result = this._highDemandAdapter.sendHighDemand(obj)
    return result
  }

  getActionFromRoles(rolId: number): Observable<any> {
    const result = this._highDemandAdapter.getActionFromRoles(rolId)
    return result
  }

  deriveHighDemand(obj: any): Observable<any> {
    const result = this._highDemandAdapter.deriveHighDemand(obj)
    return result
  }

  returnHighDemand(obj: any): Observable<any> {
    const result = this._highDemandAdapter.returnHighDemand(obj)
    return result
  }

  approveHighDemand(obj: any): Observable<any> {
    const result = this._highDemandAdapter.approveHighDemand(obj)
    return result
  }

  declineHighDeamand(obj: any): Observable<any> {
    const result = this._highDemandAdapter.declineHighDemand(obj)
    return result
  }

  cancelHighDemand(obj: any): Observable<any> {
    const result = this._highDemandAdapter.cancelHighDemand(obj)
    return result
  }

  getHighDemands(departmentId: number): Observable<any> {
    const result = this._highDemandAdapter.getHighDemands(departmentId)
    return result
  }

  download(highDemandId: number): Observable<Blob> {
    return this._highDemandAdapter.download(highDemandId)
  }
}