import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthAdapterService } from '../adapters/auth-api.service';
import { InstitutionAdapterService } from '../adapters/institution-api.service';
import { InstitutionCourseAdapterService } from '../adapters/institution-course.service';
import { AbilityService } from './services/ability.service';
import { TeacherAdapterService } from '../adapters/teacher.service';
import { HighDemandAdapterService } from '../adapters/high-demand.service';
import { HistoryAdapterService } from '../adapters/history.service';
import { HistoryManager } from '../domain/history-manager';
import { AppStore } from './store/app.store';
import { PreRegistrationAdapterService } from '../adapters/pre-registration.service';
import { RolAdapterService } from '../adapters/rol.sevice';
import { PermissionAdapterService } from '../adapters/perimssion.sevice';
import { OperativeAdapterService } from '../adapters/operative.service';

import UserAuthManager from '../domain/user-auth-manager';
import InstitutionManager from '../domain/institution-manager';
import CourseManager from '../domain/course-manager';
import HighDemandManager from '../domain/high-demand-manager';
import PreRegistrationManager from '../domain/pre-registration-manager';
import RolManager from '../domain/rol-manager';
import PermissionManager from '../domain/permission-manager';
import OperativeManager from '../domain/operative-manager';

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

    ngOnInit(): void {
      const { user } = this.appStore.snapshot
      if(user) {
        this.abilityService.loadAbilities(user.userId).subscribe(() => {
          const ability = this.abilityService.getAbility()
          console.log("habilidades --> ", ability.rules)
          this.cdr.detectChanges();
        });
      }
    }
}
