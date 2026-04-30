import { MENU_ADMIN } from './menu-admin.config';
import { MENU_ALUMNO } from './menu-alumno.config';
import { MENU_PROFESOR } from './menu-profesor.config';

export const MENU_CONFIG: Record<string, any[]> = {
  admin: MENU_ADMIN,
  alumno: MENU_ALUMNO,
  profesor: MENU_PROFESOR
};