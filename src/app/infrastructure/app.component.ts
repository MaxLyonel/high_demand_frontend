import { Component, OnInit } from '@angular/core';
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
    { provide: 'IHistory', useClass: HistoryManager }
  ]
})
export class AppComponent implements OnInit {
    title = 'Alta Demanda'

    constructor(private abilityService: AbilityService) {}

    ngOnInit() {
      this.abilityService.loadAbilities().subscribe(() => {
        console.log('Abilities cargadas');
      });
    }
}
