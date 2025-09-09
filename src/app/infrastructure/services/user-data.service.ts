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
      case 37:
      case 38:
      case 48:
        this.router.navigate(['/alta-demanda/main-inbox'])
        break;
      case 50:
        this.router.navigate(['/alta-demanda/dashboard'])
    }
  }
}