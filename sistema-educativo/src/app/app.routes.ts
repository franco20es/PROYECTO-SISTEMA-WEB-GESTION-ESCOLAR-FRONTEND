import { Routes } from '@angular/router';
import { MainLayout } from './layouts/Main/main-layout/main-layout';
import { ADMIN_ROUTES } from './features/admin/admin-routing.module';
import { Login } from './features/auth/login/login/login';
import { Matricula } from './features/web/matricula/matricula/matricula';
import { Inicio } from './features/web/inicio/inicio/inicio';
import { INICIO_ROUTER } from './features/web/matricula/inicio-routing.module'; 
import { authGuard, rolGuard } from './core/guards/authGuard';
import { RecuperarPassword } from './features/auth/recuperar-contraseña/recuperar-contrasena/recuperar-contrasena';


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
    path: 'inicios',
    loadComponent: () => import('./features/web/inicio/components/inicioPage/inicio-page/inicio-page').then(m => m.InicioPage)
  },
  {
  path: 'recuperar-contrasena-form',
  loadComponent: () => import('./features/auth/recuperar-contraseña/recuperar-contrasena/recuperar-contrasena')
    .then(m => m.RecuperarPassword)
},
{
  path: 'restablecer-password',
  loadComponent: () => import('./features/auth/restablecer-contrasena/restablecer-contrasena')
    .then(m => m.RestablecerPassword)
},
  {
    path: 'inicio',
    loadChildren: () => import('./features/web/matricula/inicio-routing.module').then(m => m.INICIO_ROUTER)
  },
  {
    path: 'admin',
    component: MainLayout,
    canActivate: [authGuard, rolGuard(['ADMIN','DIRECTOR','SECRETARIA'])],
    children: [{
      path: '',
      loadChildren: () => import('./features/admin/admin-routing.module')
        .then(m => m.ADMIN_ROUTES)
    }]
  },
  {
    path: 'alumno',
    component: MainLayout,
    canActivate: [authGuard, rolGuard(['ALUMNO'])],
    children: [{
      path: '',
      loadChildren: () => import('./features/alumno/alumno-routing.module')
        .then(m => m.ALUMNO_ROUTES)
    }]
  },
  {
    path: 'profesor',
    component: MainLayout,
    canActivate: [authGuard, rolGuard(['DOCENTE'])],
    children: [{
      path: '',
      loadChildren: () => import('./features/profesor/profesor-routing.module')
        .then(m => m.PROFESOR_ROUTES)
    }]
  },
  { path: '**', redirectTo: 'inicio' }
];