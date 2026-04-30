import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ModalAsistencia } from '../../../components/modales/modal-asistencia/modal-asistencia';

@Component({
  selector: 'app-asistencia',
  standalone: true,
  imports: [CommonModule, ModalAsistencia],
  templateUrl: './asistencia.html',
  styleUrl: './asistencia.css',
})
export class AsistenciaAlumno {
  mostrarAsistencia = false;
  cursoSeleccionadoAsistencia: any = null;

  cursos = [
    {
      nombre: 'Desarrollo Web',
      profesor: 'Dr. López',
      porcentaje: 90,
      clasesAsistidas: 18,
      clasesTotal: 20,
      estado: 'aprobado',
      asistio: 18,
      noAsistio: 0,
      pendiente: 2,
      sinRegistro: 0,
      calendario: [
        { mes: 'Marzo 2026', dias: [{ fecha: 'Sáb 28', estado: 'asistio' }] },
        { mes: 'Abril 2026', dias: [
          { fecha: 'Sáb 04', estado: 'asistio' },
          { fecha: 'Sáb 11', estado: 'asistio' },
          { fecha: 'Sáb 18', estado: 'pendiente' },
          { fecha: 'Sáb 25', estado: 'asistio' },
        ] },
      ]
    },
    {
      nombre: 'Base de Datos',
      profesor: 'Mg. Ríos',
      porcentaje: 75,
      clasesAsistidas: 15,
      clasesTotal: 20,
      estado: 'aprobado',
      asistio: 15,
      noAsistio: 2,
      pendiente: 3,
      sinRegistro: 0,
      calendario: [
        { mes: 'Marzo 2026', dias: [{ fecha: 'Mar 31', estado: 'asistio' }] },
      ]
    },
    {
      nombre: 'Redes',
      profesor: 'Ing. Torres',
      porcentaje: 67,
      clasesAsistidas: 12,
      clasesTotal: 18,
      estado: 'enRiesgo',
      asistio: 12,
      noAsistio: 3,
      pendiente: 3,
      sinRegistro: 0,
      calendario: [
        { mes: 'Marzo 2026', dias: [{ fecha: 'Jue 26', estado: 'asistio' }] },
      ]
    },
    {
      nombre: 'Matemática III',
      profesor: 'Dr. Vargas',
      porcentaje: 95,
      clasesAsistidas: 20,
      clasesTotal: 21,
      estado: 'aprobado',
      asistio: 20,
      noAsistio: 0,
      pendiente: 1,
      sinRegistro: 0,
      calendario: [
        { mes: 'Marzo 2026', dias: [{ fecha: 'Mié 27', estado: 'asistio' }] },
      ]
    },
    {
      nombre: 'IA y Machine Learning',
      profesor: 'Mg. Salas',
      porcentaje: 80,
      clasesAsistidas: 16,
      clasesTotal: 20,
      estado: 'aprobado',
      asistio: 16,
      noAsistio: 1,
      pendiente: 3,
      sinRegistro: 0,
      calendario: [
        { mes: 'Marzo 2026', dias: [{ fecha: 'Lun 25', estado: 'asistio' }] },
      ]
    },
    {
      nombre: 'Ética Profesional',
      profesor: 'Lic. Morales',
      porcentaje: 88,
      clasesAsistidas: 14,
      clasesTotal: 16,
      estado: 'aprobado',
      asistio: 14,
      noAsistio: 0,
      pendiente: 2,
      sinRegistro: 0,
      calendario: [
        { mes: 'Marzo 2026', dias: [{ fecha: 'Vie 29', estado: 'asistio' }] },
      ]
    },
  ];

  verAsistencia(curso: any): void {
    this.cursoSeleccionadoAsistencia = curso;
    this.mostrarAsistencia = true;
  }

  cerrarAsistencia(): void {
    this.mostrarAsistencia = false;
    this.cursoSeleccionadoAsistencia = null;
  }

  getColorPorcentaje(porcentaje: number): string {
    if (porcentaje >= 80) return 'excelente';
    if (porcentaje >= 70) return 'bueno';
    if (porcentaje >= 60) return 'regular';
    return 'bajo';
  }

  getColorEstado(estado: string): string {
    return estado === 'aprobado' ? 'aprobado' : 'enRiesgo';
  }
}
   