import { Routes } from '@angular/router';
import { MainLayout } from './layouts/Main/main-layout/main-layout';
import { ADMIN_ROUTES } from './features/admin/admin-routing.module';
import { Login } from './features/auth/login/login/login';
import { Matricula } from './features/web/matricula/matricula/matricula';
import { Inicio } from './features/web/inicio/inicio/inicio';
// Rutas principales de la aplicación
export const routes: Routes = [
  {
    path: 'login',
    component: Login
  },
{
  path: '',
  redirectTo: 'inicio',
  pathMatch: 'full'
},
{
  path: 'inicio',
  component: Inicio
},
  {
    path: 'admin',
    component: MainLayout,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/admin/admin-routing.module')
            .then(m => m.ADMIN_ROUTES)
      }
    ]
  },

  {
    path: 'alumno',
    component: MainLayout,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/alumno/alumno-routing.module')
            .then(m => m.ALUMNO_ROUTES)
      }
    ]
  },

  {
    path: 'profesor',
    component: MainLayout,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/profesor/profesor-routing.module')
            .then(m => m.PROFESOR_ROUTES)
      }
    ]
  },

  {
    path: 'matricula',
    component: Matricula
  }
];