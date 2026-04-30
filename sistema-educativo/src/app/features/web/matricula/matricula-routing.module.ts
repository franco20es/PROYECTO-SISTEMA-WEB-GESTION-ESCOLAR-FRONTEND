
import { Router, Routes } from '@angular/router';
import { Matricula } from './matricula/matricula';

import { FinalizarMatricula } from './components/finalizar-matricula/finalizar-matricula/finalizar-matricula';
import { MatriculaAlumno } from './components/matricula/matricula-alumno/matricula-alumno';

export const MATRICULA_ROUTES: Routes = [

   { path: '', redirectTo: 'datos', pathMatch: 'full' },

   {
    path: 'datos',
    loadComponent: () => import('./components/DatosAlumno/datos-alumno/datos-alumno').then(m => m.DatosAlumno)
   },
  { 
    path: 'matricula-alumno', 
    component: MatriculaAlumno

  },
  {
    path:'finalizar-matricula',
    loadComponent: () => import('./components/finalizar-matricula/finalizar-matricula/finalizar-matricula').then(m => m.FinalizarMatricula)
  }
];