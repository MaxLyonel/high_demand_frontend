// framework angular
import { Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
// libraries
import { switchMap, tap } from "rxjs";
// own implementations
import IManagerTeacher from '../../domain/ports/i-manager-teacher';
import IInstituionDetail from "../../domain/ports/i-institution-detail";
import { AppStore } from "../store/app.store";


@Injectable({ providedIn: 'root'})
export class UserDataService {

  constructor(
    @Inject('IManagerTeacher')   private _teacher: IManagerTeacher,
    @Inject('IInstituionDetail') private _institution: IInstituionDetail,
    private appStore: AppStore,
    private router: Router
  ) {}

  loadUserSpecificData(user: any) {
    if(!user && !user.id && !user.selectedRole) return;
      switch(user.selectedRole.id) {
        case 9:
          this._teacher.getInfoTeacher(user.personId).pipe(
            tap(teacherInfo => this.appStore.setTeacherInfo(teacherInfo)),
            switchMap(teacherInfo => this._institution.getInfoInstitution(teacherInfo.educationalInstitutionId)),
            tap(instInfo => this.appStore.setInstitutionInfo(instInfo))
          ).subscribe(()=> {
            this.router.navigate(['/alta-demanda/postulacion'])
          });
        break;
      }
  }
}