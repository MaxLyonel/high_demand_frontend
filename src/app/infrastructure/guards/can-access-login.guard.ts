// can-access-login.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { AuthAdapterService } from '../../adapters/auth-api.service';

export const canAccessLoginGuard: CanActivateFn = () => {
  const authService = inject(AuthAdapterService);
  const router = inject(Router);

  return authService.isAuthenticated().pipe(
    map(isAuth => {
      if (isAuth) {
        // Si está autenticado, redirigir a la home (o dashboard)
        router.navigate(['/alta-demanda/postulacion']);
        return false;
      }
      return true;
    })
  );
};
