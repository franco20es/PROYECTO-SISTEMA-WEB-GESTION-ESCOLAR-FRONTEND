import { Routes } from "@angular/router";


// Rutas específicas para el módulo de profesores
export const PROFESOR_ROUTES: Routes = [

   { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path:'cursos',
    loadComponent:()=> import('./pages/cursos/cursos/cursos').then(m=>m.CursosProfesor)
  },
  {
    path: 'estudiantes',
    loadComponent: () => import('./pages/estudiantes/estudiantes').then(m => m.Estudiantes),
  },
  {
    path: 'asistencia',
    loadComponent: () => import('./pages/asistencia/asistencia').then(m => m.Asistencia),
  },
  {
    path:'calificaciones',
    loadComponent:()=> import('./pages/calificaciones/calificaciones').then(m=>m.Calificaciones)
  },
  {
    path: 'evaluacion',
    loadComponent: () => import('./pages/evaluacion/evaluacion').then(m => m.Evaluacion),
  },
  {
    path: 'horario',
    loadComponent: () => import('./pages/horariop/horariop').then(m => m.Horariop),
  },
  {
    path: 'reportes',
    loadComponent: () => import('./pages/reportes/reportes').then(m => m.Reportes),
  },
  {
    path: 'perfil',
    loadComponent: () => import('./pages/perfilp/perfilp').then(m => m.Perfilp),
  },
  {
    path: 'notificaciones',
    loadComponent: () => import('./pages/notificaciones/notificaciones').then(m => m.Notificaciones),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard),
  }
   // Otras rutas para el módulo de profesores
  
  


  // Aquí puedes agregar más rutas para otras páginas del módulo de profesores
];