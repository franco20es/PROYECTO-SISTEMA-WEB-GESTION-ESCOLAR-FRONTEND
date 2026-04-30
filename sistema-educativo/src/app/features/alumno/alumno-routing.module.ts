import { Routes } from "@angular/router";
import { MainLayout } from "../../layouts/Main/main-layout/main-layout";


// Rutas específicas para el módulo de administración
export const ALUMNO_ROUTES: Routes = [

  { path: '', redirectTo: 'cursos', pathMatch: 'full' },
  {
    path: 'cursos',
    loadComponent: () => import('./pages/cursos/cursos/cursos').then(m => m.CursosAlumno)
  },
  {
    path: 'notas',
    loadComponent: () => import('./pages/notas/notas/notas').then(m => m.NotasAlumno)
  },
  {
    path: 'asistencia',
    loadComponent: () => import('./pages/asistencia/asistencia/asistencia').then(m => m.AsistenciaAlumno)
  },
  {
    path: 'notificaciones',
    loadComponent: () => import('./pages/notificaciones/notificaciones/notificaciones').then(m => m.NotificacionesAlumno)
  },
  {
    path: 'perfil',
    loadComponent: () => import('./pages/perfil/perfil/perfil').then(m => m.PerfilAlumno)
  },
  {
    path: 'horario',
    loadComponent: () => import('./pages/horario/horario/horario').then(m => m.Horario)
  }, {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard/dashboard').then(m => m.DashboardAlumno)
  },
  {
    path: 'pagos',
    loadComponent: () => import('./pages/pagos/pago/pago').then(m => m.PagoAlumno)
  },
  {
    path: 'pagos/detalle-pago',
    loadComponent: () => import('./pages/pagos/pago/Detalle/detalle-pago/detalle-pago').then(m => m.DetallePagoComponent)
  },
  {
    path: 'opciones-pago', // Esta carga las opciones (alumno/pagos/1/opciones-pago)
    loadComponent: () => import('./pages/pagos/pago/opciones-pago/opciones-pago/opciones-pago').then(m => m.OpcionesPago)
  },
  {
    path: 'pago-online',
    loadComponent: () => import('./pages/pagos/pago/pago-online/pago-online/pago-online').then(m => m.PagoOnline)
  }

];