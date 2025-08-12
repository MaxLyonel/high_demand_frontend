// framework angular
import { Inject, Injectable } from "@angular/core";
// own implementations
import IManagerTeacher from '../../domain/ports/i-manager-teacher';
import IInstituionDetail from "../../domain/ports/i-institution-detail";
import { AppStore } from "../store/app.store";
import { switchMap, tap } from "rxjs";


@Injectable({ providedIn: 'root'})
export class UserDataService {

  constructor(
    @Inject('IManagerTeacher')   private _teacher: IManagerTeacher,
    @Inject('IInstituionDetail') private _institution: IInstituionDetail,
    private appStore: AppStore
  ) {}

  loadUserSpecificData(user: any) {
    if(!user || !user.roles) return
    for (const role of user.roles) {
      switch(role.id) {
        case 9:
          this._teacher.getInfoTeacher(user.personId).pipe(
            tap(teacherInfo => this.appStore.setTeacherInfo(teacherInfo)),
            switchMap(teacherInfo => this._institution.getInfoInstitution(teacherInfo.educationalInstitutionId)),
            tap(instInfo => this.appStore.setInstitutionInfo(instInfo))
          ).subscribe();
        break;
      }
    }
  }
}