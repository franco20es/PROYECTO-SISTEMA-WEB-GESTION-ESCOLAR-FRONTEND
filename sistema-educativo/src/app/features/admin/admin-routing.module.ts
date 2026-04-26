import { Routes } from "@angular/router";
import { MainLayout } from "../../layouts/Main/main-layout/main-layout";


// Rutas específicas para el módulo de administración
export const ADMIN_ROUTES: Routes = [

   { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./pages/dashboard/dashboard/dashboard').then(m => m.Dashboard) 
  }
  ,{
    path:'cursos',
    loadComponent:()=> import('./pages/cursos/cursos/cursos').then(m=>m.CursosComponent)
  },
  {
    path:'estudiantes',
    loadComponent:()=> import('./pages/alumnos/alumnos/alumnos').then(m=>m.Alumnos)
  }
  // Aquí puedes agregar más rutas para otras páginas del módulo de administración

];