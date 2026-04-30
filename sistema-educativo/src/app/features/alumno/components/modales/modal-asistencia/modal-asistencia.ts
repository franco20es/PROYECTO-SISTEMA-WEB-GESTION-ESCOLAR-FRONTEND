import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-asistencia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-asistencia.html',
  styleUrl: './modal-asistencia.css',
})
export class ModalAsistencia {
  @Input() mostrarAsistencia = false;
  @Input() cursoSeleccionadoAsistencia: any = null;
  @Output() cerrarModal = new EventEmitter<void>();

  cerrarAsistencia(): void {
    this.cerrarModal.emit();
  }

  getAsistio(): number {
    if (this.cursoSeleccionadoAsistencia?.asistencia?.asistio !== undefined) {
      return this.cursoSeleccionadoAsistencia.asistencia.asistio;
    }
    return this.cursoSeleccionadoAsistencia?.asistio || 0;
  }

  getNoAsistio(): number {
    if (this.cursoSeleccionadoAsistencia?.asistencia?.noAsistio !== undefined) {
      return this.cursoSeleccionadoAsistencia.asistencia.noAsistio;
    }
    return this.cursoSeleccionadoAsistencia?.noAsistio || 0;
  }

  getPendiente(): number {
    if (this.cursoSeleccionadoAsistencia?.asistencia?.pendiente !== undefined) {
      return this.cursoSeleccionadoAsistencia.asistencia.pendiente;
    }
    return this.cursoSeleccionadoAsistencia?.pendiente || 0;
  }

  getSinRegistro(): number {
    if (this.cursoSeleccionadoAsistencia?.asistencia?.sinRegistro !== undefined) {
      return this.cursoSeleccionadoAsistencia.asistencia.sinRegistro;
    }
    return this.cursoSeleccionadoAsistencia?.sinRegistro || 0;
  }

  getCalendario(): any[] {
    return this.cursoSeleccionadoAsistencia?.asistencia?.calendario || 
           this.cursoSeleccionadoAsistencia?.calendario || [];
  }
}
