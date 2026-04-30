import { Component } from '@angular/core';
import { TopbarWebComponent } from '../components/topbar-web/topbar-web';
import { DatosAlumno } from '../components/DatosAlumno/datos-alumno/datos-alumno';

import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-matricula',
  standalone: true,
  imports: [TopbarWebComponent,RouterOutlet],
  templateUrl: './matricula.html',
  styleUrl: './matricula.css',
})
export class Matricula {}
