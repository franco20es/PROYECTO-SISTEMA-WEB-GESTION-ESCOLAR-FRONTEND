
// configuracion de rutas protegidas pro autenticacion y rol

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AutenticacionService } from '../services/autenticacion/auth.service'; 

export const authGuard: CanActivateFn = () => {
  const auth = inject(AutenticacionService);
  const router = inject(Router);

  if (auth.isLoggedIn()) return true;

  router.navigate(['/login']);
  return false;
};

// ─── RolGuard para proteger por rol ──────────────────────────────────────────
export const rolGuard = (rolesPermitidos: string[]): CanActivateFn => {
  return () => {
    const auth = inject(AutenticacionService);
    const router = inject(Router);
    const rol = auth.getRol();

    if (rol && rolesPermitidos.includes(rol)) return true;

    router.navigate(['/login']);
    return false;
  };
};