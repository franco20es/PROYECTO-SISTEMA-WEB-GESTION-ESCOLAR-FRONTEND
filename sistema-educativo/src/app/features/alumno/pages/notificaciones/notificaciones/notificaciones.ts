import { Component } from '@angular/core';

@Component({
  selector: 'app-notificaciones',
  imports: [],
  templateUrl: './notificaciones.html',
  styleUrl: './notificaciones.css',
})
export class NotificacionesAlumno {

  verHorario(): void {
   
    window.location.href = '/alumno/horario';
  }
  verNotas(): void {
    window.location.href = '/alumno/notas';
  }

  verTarea(): void {
    window.location.href = '/alumno/cursos';
  }
}
