import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthAdapterService } from '../adapters/auth-api.service';
import UserAuthManager from '../domain/user-auth-manager';
import { InstitutionAdapterService } from '../adapters/institution-api.service';
import InstitutionManager from '../domain/institution-manager';
import { InstitutionCourseAdapterService } from '../adapters/institution-course.service';
import CourseManager from '../domain/course-manager';

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
    { provide: 'ICourseList', useClass: CourseManager }
  ]
})
export class AppComponent {
  title = 'Alta Demanda'
}
