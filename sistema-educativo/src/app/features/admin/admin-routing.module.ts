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
  },
  {
    path:'matricula',
    loadComponent:()=> import('./pages/matriculas/matriculas/matriculas').then(m=>m.Matriculas)
  },
  {
    path:'profesores',
    loadComponent:()=> import('./pages/profesores/profesores/profesores').then(m=>m.Profesores)
  },
  {
    path:'asistencia',
    loadComponent:()=> import('./pages/asistencia/asistencia/asistencia').then(m=>m.Asistencia)
  },
  {
    path:'finanzas',
    loadComponent:()=> import('./pages/finanzas/finanzas/finanzas').then(m=>m.Finanzas)
  },
  {
    path:'calificaciones',
    loadComponent:()=> import('./pages/calificaciones/calificaciones/calificaciones').then(m=>m.Calificaciones)
  },
  {
    path:'notificaciones',
    loadComponent:()=> import('./pages/notificaciones/notificaciones/notificaciones').then(m=>m.Notificaciones)
  },
  {
    path:'configuracion',
    loadComponent:()=> import('./pages/configuracion/configuracion/configuracion').then(m=>m.Configuracion)
  },
  {
    path:'solicitudes',
    loadComponent:()=> import('./pages/matricula-online/matricula-online/matricula-online').then(m=>m.MatriculaOnline)
  }
  // Aquí puedes agregar más rutas para otras páginas del módulo de administración

];