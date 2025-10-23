// framework angular
import { Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
// libraries
import { switchMap, tap } from "rxjs";
// own implementations
import IManagerTeacher from '../../domain/ports/i-manager-teacher';
import IInstituionDetail from "../../domain/ports/i-institution-detail";
import { AppStore } from "../store/app.store";
import { APP_CONSTANTS } from "../constants/constants";


@Injectable({ providedIn: 'root'})
export class UserDataService {

  constructor(
    @Inject('IManagerTeacher')   private _teacher: IManagerTeacher,
    @Inject('IInstituionDetail') private _institution: IInstituionDetail,
    private appStore: AppStore,
    private router: Router
  ) {}

  loadUserSpecificData(user: any) {
    if(!user && !user.id && !user.selectedRole && !user.selectedRole.role) {
      console.error("Sin roles")
      return;
    }
    const roleId = user.selectedRole.role.id
    switch(roleId) {
      case APP_CONSTANTS.ROLES.DIRECTOR_ROLE:
      case APP_CONSTANTS.ROLES.VER_ROLE:
        this._teacher.getInfoTeacher(user.person.id).pipe(
          tap((teacherInfo: any) => this.appStore.setTeacherInfo(teacherInfo.data)),
          switchMap((teacherInfo:any) => {
            const { data } = teacherInfo
            return this._institution.getInfoInstitution(data.educationalInstitutionId)
          }),
          tap(instInfo => this.appStore.setInstitutionInfo(instInfo))
        ).subscribe({
          next: () => {
            this.router.navigate(['/alta-demanda/postulacion'])
          },
          error: (err) => {
              console.error('Error cargando datos del usuario:', err);
          }
        });
        break;
      case APP_CONSTANTS.ROLES.DISTRICT_ROLE:
      case APP_CONSTANTS.ROLES.DEPARTMENT_ROLE:
        this.router.navigate(['/alta-demanda/main-inbox'])
        break;
      case APP_CONSTANTS.ROLES.ADMIN_ROLE:
        this.router.navigate(['/alta-demanda/admin'])
    }
  }
}