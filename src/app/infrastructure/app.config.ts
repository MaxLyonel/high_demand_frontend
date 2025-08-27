import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { mainRoutes } from './app.routes';
import { icons } from '../icons-provider';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { es_ES, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { apiBaseInterceptor } from './interceptors/api-base.interceptor';
import { TeacherAdapterService } from '../adapters/teacher.service';
import { InstitutionAdapterService } from '../adapters/institution-api.service';
import InstitutionManager from '../domain/institution-manager';

registerLocaleData(es);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(mainRoutes),
    provideNzIcons(icons),
    provideNzI18n(es_ES),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([apiBaseInterceptor])),
    { provide: 'IManagerTeacher', useClass: TeacherAdapterService },
    { provide: 'IManagerInstitution', useClass: InstitutionAdapterService }, // ADAPTER
    { provide: 'IInstituionDetail', useClass: InstitutionManager },
  ]
};
