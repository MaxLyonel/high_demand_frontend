import { Inject, Injectable } from "@angular/core";
import IPreRegistration from "./ports/i-pre-registration";
import { Observable } from "rxjs";
import { PreRegistrationAdapterService } from "../adapters/pre-registration.service";

@Injectable()
export default class PreRegistrationManager implements IPreRegistration {

  constructor(
    @Inject('IManagerPreRegistration')
    private _preRegistrationAdapter: PreRegistrationAdapterService
  ){}

  getCriterias(): Observable<any> {
    const result = this._preRegistrationAdapter.getCriterias()
    return result
  }
  getRelationships(): Observable<any> {
    const result = this._preRegistrationAdapter.getRelationships()
    return result
  }

  getMunicipies(): Observable<any> {
    const result = this._preRegistrationAdapter.getMunicipies()
    return result
  }

  searchStudent(sie: number, codeRude: string): Observable<any> {
    const result = this._preRegistrationAdapter.searchStudent(sie, codeRude)
    return result
  }

  savePreRegistration(obj: any): Observable<any> {
    const result = this._preRegistrationAdapter.savePreRegistration(obj)
    return result
  }

  getListPreRegistration(highDemandId: number): Observable<any> {
    const result = this._preRegistrationAdapter.getListPreRegistrations(highDemandId)
    return result
  }

  updatedStatus(preRegistrationId: number): Observable<any> {
    const result = this._preRegistrationAdapter.updatedStatus(preRegistrationId)
    return result
  }

  getListAccpeted(): Observable<any> {
    const result = this._preRegistrationAdapter.getListAccepted()
    return result
  }

  getLevels(): Observable<any> {
    const result = this._preRegistrationAdapter.getListLevels()
    return result
  }

}