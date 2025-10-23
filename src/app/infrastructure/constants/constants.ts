// en algún constants.ts
import { HttpContextToken } from '@angular/common/http';
export const IS_USER_ACTION = new HttpContextToken(() => false);

export const APP_CONSTANTS = {
  CURRENT_YEAR: new Date().getFullYear(),
  BROTHER_JUSTIFICATION: 1,
  HOUSING_JUSTIFICATION: 2,
  WORKPLACE_JUSTIFICATION: 3,
  ROLES: {
    DIRECTOR_ROLE: 9,
    DISTRICT_ROLE: 37,
    DEPARTMENT_ROLE: 38,
    VER_ROLE: 48,
    POSTULANT_ROLE: 49,
    ADMIN_ROLE: 50
  }
};
