import { Component } from '@angular/core';
import { AlumnoForm } from "../components/alumno-form/alumno-form/alumno-form";
import { ApoderadoForm } from "../components/apoderado-form/apoderado-form/apoderado-form";
import { GradoForm } from "../components/grado/grado-form/grado-form";
import { PagoForm } from '../components/pago/pago-form/pago-form';
import { MatriculaWizard } from '../components/MatriculaWizard/matricula-wizard/matricula-wizard';



@Component({
  selector: 'app-matriculas',
  standalone: true,
  imports: [MatriculaWizard],
  template: `<app-matricula-wizard></app-matricula-wizard>`
})
export class Matriculas {
  
}
