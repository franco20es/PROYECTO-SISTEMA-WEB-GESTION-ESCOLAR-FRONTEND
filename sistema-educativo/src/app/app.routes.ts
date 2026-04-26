import { Routes } from '@angular/router';
import { MainLayout } from './layouts/Main/main-layout/main-layout';
import { ADMIN_ROUTES } from './features/admin/admin-routing.module';
import { Login } from './features/auth/login/login/login';
// Rutas principales de la aplicación
export const routes: Routes = [
   {
    path:'login',
    component:Login
   },
  {
    path: 'admin',
    component: MainLayout, // El Layout se carga aquí como "cascarón"
    // Carga el archivo de rutas interno del admin
    loadChildren: () => import('./features/admin/admin-routing.module').then(m => m.ADMIN_ROUTES)
  },
  {
    path: 'user',
    component: MainLayout, // El Layout se carga aquí como "cascarón"
    loadChildren: () => import('./features/alumno/alumno-routing.module').then(m => m.ALUMNO_ROUTES)  
  },
  {
    path: 'profesor',
    component: MainLayout, // El Layout se carga aquí como "cascarón"
    loadChildren: () => import('./features/profesor/profesor-routing.module').then(m => m.PROFESOR_ROUTES)
  }
];
