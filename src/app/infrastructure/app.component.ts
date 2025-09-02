import { ParticlesGroups } from './../../../node_modules/tsparticles-engine/types/Types/ParticlesGroups.d';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthAdapterService } from '../adapters/auth-api.service';
import UserAuthManager from '../domain/user-auth-manager';
import { InstitutionAdapterService } from '../adapters/institution-api.service';
import InstitutionManager from '../domain/institution-manager';
import { InstitutionCourseAdapterService } from '../adapters/institution-course.service';
import CourseManager from '../domain/course-manager';
import { AbilityService } from './services/ability.service';
import { TeacherAdapterService } from '../adapters/teacher.service';
import { HighDemandAdapterService } from '../adapters/high-demand.service';
import HighDemandManager from '../domain/high-demand-manager';
import IManagerHistory from '../domain/ports/i-manager-history';
import { HistoryAdapterService } from '../adapters/history.service';
import IHistory from '../domain/ports/i-history';
import { HistoryManager } from '../domain/history-manager';
import { User } from '../domain/models/user.model';
import { AppStore } from './store/app.store';
import { PreRegistrationAdapterService } from '../adapters/pre-registration.service';
import PreRegistrationManager from '../domain/pre-registration-manager';
import RolManager from '../domain/rol-manager';
import IRoles from '../domain/ports/i-roles';
import { RolAdapterService } from '../adapters/rol.sevice';
import { PermissionAdapterService } from '../adapters/perimssion.sevice';
import PermissionManager from '../domain/permission-manager';
import OperativeManager from '../domain/operative-manager';
import { OperativeAdapterService } from '../adapters/operative.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet/>`,
  providers: [
    { provide: 'IManagerAuth', useClass: AuthAdapterService }, // INFRASTRUCTURE
    { provide: 'IAuthorizeUser', useClass: UserAuthManager },

    { provide: 'IManagerInstitution', useClass: InstitutionAdapterService }, // ADAPTER
    { provide: 'IInstituionDetail', useClass: InstitutionManager },

    { provide: 'IManagerInstitutionCourse', useClass: InstitutionCourseAdapterService },
    { provide: 'ICourseList', useClass: CourseManager },

    { provide: 'IManagerTeacher', useClass: TeacherAdapterService },

    { provide: 'IManagerHighDemand', useClass: HighDemandAdapterService },
    { provide: 'IHighDemand', useClass: HighDemandManager},

    { provide: 'IManagerHistory', useClass: HistoryAdapterService },
    { provide: 'IHistory', useClass: HistoryManager },

    { provide: 'IManagerPreRegistration', useClass: PreRegistrationAdapterService },
    { provide: 'IPreRegistration', useClass: PreRegistrationManager },

    { provide: 'IManagerRol', useClass: RolAdapterService },
    { provide: 'IRoles', useClass: RolManager },

    { provide: 'IManagerPermission', useClass: PermissionAdapterService },
    { provide: 'IPermission', useClass: PermissionManager},

    { provide: 'IManagerOperative', useClass: OperativeAdapterService },
    { provide: 'IOperative', useClass: OperativeManager}
  ]
})
export class AppComponent implements OnInit {
    title = 'Alta Demanda'

    private appStore = inject(AppStore)
    private cdr = inject(ChangeDetectorRef)

    constructor(private abilityService: AbilityService) {}

    // ngOnInit() {
    //   this.abilityService.loadAbilities(92506063).subscribe(() => {
    //     const ability = this.abilityService.getAbility()
    //     const user = new User(92506063);
    //     console.log('Puede actualizar?', ability.can('update', user));

    //     // Pasa la misma clase a rulesFor usando detectSubjectType
    //     ability.rulesFor('update', 'user').forEach((rule, i) => {
    //       const matchesConditions = rule.conditions
    //         ? Object.entries(rule.conditions).every(
    //             ([key, value]) => (user as any)[key] === value
    //           )
    //         : true;

    //       console.log(`Regla ${i + 1}:`, rule);
    //       console.log('¿Coincide con las condiciones?', matchesConditions);
    //     });
    //   })
    // }
    ngOnInit(): void {
      const { user } = this.appStore.snapshot
      if(user) {
        this.abilityService.loadAbilities(user.userId).subscribe(() => {
          const ability = this.abilityService.getAbility()
          this.cdr.detectChanges();
        });
      }
        // const user = new User(92506063, 'leonel', 'leonel', true, 1);
      
        // // Verificar permisos normal
        // console.log('Puede actualizar?', this.abilityService.getAbility().can('update', user));
      
        // // Debug completo
        // this.abilityService.debugCan('update', user);
    }
}
