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

  updatePreRegistration(obj: any): Observable<any> {
    const result = this._preRegistrationAdapter.updatePreRegistration(obj)
    return result
  }

  invalidatePreRegistration(obj: any): Observable<any> {
    const result = this._preRegistrationAdapter.invalidatePreRegistration(obj)
    return result
  }

  validatePreRegistration(obj: any): Observable<any> {
    const result = this._preRegistrationAdapter.validatePreRegistration(obj)
    return result
  }

  acceptPreRegistrations(obj: any): Observable<any> {
    const result = this._preRegistrationAdapter.acceptPreRegistrations(obj)
    return result
  }

  getListPreRegistration(highDemandId: number): Observable<any> {
    const result = this._preRegistrationAdapter.getListPreRegistrations(highDemandId)
    return result
  }

  getListValidPreRegistration(highDemandId: number, levelId: number, gradeId: number): Observable<any> {
    const result = this._preRegistrationAdapter.getListValidPreRegistrations(highDemandId, levelId, gradeId)
    return result
  }

  getListPreRegistrationFollow(identityCardPostulant: string): Observable<any> {
    const result = this._preRegistrationAdapter.getListPreRegistrationFollow(identityCardPostulant)
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

  getDepartments(): Observable<any> {
    const result = this._preRegistrationAdapter.getListDepartments()
    return result
  }

  downloadBlob(postulantId: number): Observable<Blob> {
    return this._preRegistrationAdapter.downloadBlob(postulantId)
  }

  downloadBlobWithHeaders(id: number): Observable<Blob> {
    return this._preRegistrationAdapter.downloadBlobWithHeaders(id)
  }

  getInfoByCodeRude(codeRude: string): Observable<any> {
    return this._preRegistrationAdapter.getInfoByCodeRude(codeRude)
  }

  getDistrictByDeparment(deparmentId: number): Observable<any> {
    return this._preRegistrationAdapter.getDistrictByDepartment(deparmentId)
  }

  getCounts(courseId: number): Observable<any> {
    return this._preRegistrationAdapter.getCounts(courseId)
  }

  downloadReportByCourse(highDemandId: number, levelId: number, gradeId: number): Observable<any> {
    return this._preRegistrationAdapter.downloadReportByCourse(highDemandId, levelId, gradeId);
  }

}