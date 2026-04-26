import { Routes } from "@angular/router";
import { MainLayout } from "../../layouts/Main/main-layout/main-layout";


// Rutas específicas para el módulo de administración
export const ALUMNO_ROUTES: Routes = [

   { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path:'cursos',
    loadComponent:()=> import('./pages/cursos/cursos/cursos').then(m=>m.CursosAlumno)
  }
  // Aquí puedes agregar más rutas para otras páginas del módulo de administración

];