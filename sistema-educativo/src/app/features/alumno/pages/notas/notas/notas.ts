import { CommonModule, DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ModalAsistencia } from '../../../components/modales/modal-asistencia/modal-asistencia';

@Component({
  selector: 'app-notas',
  standalone: true,
  imports: [CommonModule, DecimalPipe, ModalAsistencia],
  templateUrl: './notas.html',
  styleUrl: './notas.css',
})
export class NotasAlumno {
  expandedIndex: number | null = null;
  mostrarAsistencia = false;
  cursoSeleccionadoAsistencia: any = null;

  notas = [
    {
      curso: 'Desarrollo Web',
      codigo: 'CS401',
      docente: 'Donayre Perez, Juan Jose',
      horario: 'Sábado: 18:30 - 20:00',
      modalidad: 'Presencial',
      horasSemanales: 2.0,
      creditos: 2.00,
      nroVez: 1,
      seccion: '47166',
      pc1: 17,
      pc2: 16,
      parcial: 15,
      trabajo: 18,
      promedio: 16.5,
      eval1Name: 'Practica calificada 1',
      eval1Code: 'PC1',
      eval1Value: 15,
      eval2Name: 'Practica calificada 2',
      eval2Code: 'PC2',
      eval2Value: '-',
      eval3Name: 'Participacion en clase',
      eval3Code: 'PA',
      eval3Value: '-',
      eval4Name: 'Proyecto final',
      eval4Code: 'PROY',
      eval4Value: '-',
      formula: '10%*[PA] + 25%*[PC1] + 25%*[PC2] + 40%*[PROY]',
      asistencia: {
        asistio: 4,
        noAsistio: 0,
        pendiente: 12,
        sinRegistro: 1,
        calendario: [
          { mes: 'Marzo 2026', dias: [{ fecha: 'Sáb 28', estado: 'asistio' }] },
          { mes: 'Abril 2026', dias: [
            { fecha: 'Sáb 04', estado: 'asistio' },
            { fecha: 'Sáb 11', estado: 'asistio' },
            { fecha: 'Sáb 18', estado: 'sinRegistro' },
            { fecha: 'Sáb 25', estado: 'asistio' },
          ] },
          { mes: 'Mayo 2026', dias: [
            { fecha: 'Sáb 02', estado: 'pendiente' },
            { fecha: 'Sáb 09', estado: 'pendiente' },
            { fecha: 'Sáb 16', estado: 'pendiente' },
            { fecha: 'Sáb 23', estado: 'pendiente' },
            { fecha: 'Sáb 30', estado: 'pendiente' },
          ] },
          { mes: 'Junio 2026', dias: [
            { fecha: 'Sáb 06', estado: 'pendiente' },
            { fecha: 'Sáb 13', estado: 'pendiente' },
            { fecha: 'Sáb 20', estado: 'pendiente' },
            { fecha: 'Sáb 27', estado: 'pendiente' },
          ] },
          { mes: 'Julio 2026', dias: [
            { fecha: 'Sáb 04', estado: 'pendiente' },
            { fecha: 'Sáb 11', estado: 'pendiente' },
            { fecha: 'Sáb 18', estado: 'pendiente' },
          ] },
        ]
      }
    },
    {
      curso: 'Base de Datos',
      codigo: 'CS402',
      docente: 'Donayre Perez, Juan Jose',
      horario: 'Martes: 18:30 - 20:00',
      modalidad: 'Presencial',
      horasSemanales: 2.0,
      creditos: 2.00,
      nroVez: 1,
      seccion: '47166',
      pc1: 14,
      pc2: 13,
      parcial: 15,
      trabajo: 14,
      promedio: 14.0,
      eval1Name: 'Practica calificada 1',
      eval1Code: 'PC1',
      eval1Value: 14,
      eval2Name: 'Practica calificada 2',
      eval2Code: 'PC2',
      eval2Value: '-',
      eval3Name: 'Participacion en clase',
      eval3Code: 'PA',
      eval3Value: '-',
      eval4Name: 'Proyecto final',
      eval4Code: 'PROY',
      eval4Value: '-',
      formula: '10%*[PA] + 25%*[PC1] + 25%*[PC2] + 40%*[PROY]',
      asistencia: {
        asistio: 6,
        noAsistio: 2,
        pendiente: 8,
        sinRegistro: 0,
        calendario: [
          { mes: 'Marzo 2026', dias: [{ fecha: 'Mar 31', estado: 'asistio' }] },
          { mes: 'Abril 2026', dias: [
            { fecha: 'Mar 07', estado: 'asistio' },
            { fecha: 'Mar 14', estado: 'asistio' },
            { fecha: 'Mar 21', estado: 'noAsistio' },
            { fecha: 'Mar 28', estado: 'asistio' },
          ] },
          { mes: 'Mayo 2026', dias: [
            { fecha: 'Mar 05', estado: 'pendiente' },
            { fecha: 'Mar 12', estado: 'pendiente' },
            { fecha: 'Mar 19', estado: 'noAsistio' },
            { fecha: 'Mar 26', estado: 'pendiente' },
          ] },
          { mes: 'Junio 2026', dias: [
            { fecha: 'Mar 02', estado: 'pendiente' },
            { fecha: 'Mar 09', estado: 'pendiente' },
            { fecha: 'Mar 16', estado: 'pendiente' },
            { fecha: 'Mar 23', estado: 'asistio' },
            { fecha: 'Mar 30', estado: 'asistio' },
          ] },
          { mes: 'Julio 2026', dias: [
            { fecha: 'Mar 07', estado: 'pendiente' },
            { fecha: 'Mar 14', estado: 'pendiente' },
          ] },
        ]
      }
    },
    {
      curso: 'Redes',
      codigo: 'CS403',
      docente: 'Donayre Perez, Juan Jose',
      horario: 'Jueves: 18:30 - 20:00',
      modalidad: 'Presencial',
      horasSemanales: 2.0,
      creditos: 2.00,
      nroVez: 1,
      seccion: '47166',
      pc1: 10,
      pc2: 12,
      parcial: 11,
      trabajo: 13,
      promedio: 11.5,
      eval1Name: 'Practica calificada 1',
      eval1Code: 'PC1',
      eval1Value: 10,
      eval2Name: 'Practica calificada 2',
      eval2Code: 'PC2',
      eval2Value: '-',
      eval3Name: 'Participacion en clase',
      eval3Code: 'PA',
      eval3Value: '-',
      eval4Name: 'Proyecto final',
      eval4Code: 'PROY',
      eval4Value: '-',
      formula: '10%*[PA] + 25%*[PC1] + 25%*[PC2] + 40%*[PROY]',
      asistencia: {
        asistio: 5,
        noAsistio: 1,
        pendiente: 10,
        sinRegistro: 0,
        calendario: [
          { mes: 'Marzo 2026', dias: [{ fecha: 'Jue 26', estado: 'asistio' }] },
          { mes: 'Abril 2026', dias: [
            { fecha: 'Jue 02', estado: 'asistio' },
            { fecha: 'Jue 09', estado: 'asistio' },
            { fecha: 'Jue 16', estado: 'asistio' },
            { fecha: 'Jue 23', estado: 'noAsistio' },
            { fecha: 'Jue 30', estado: 'asistio' },
          ] },
          { mes: 'Mayo 2026', dias: [
            { fecha: 'Jue 07', estado: 'pendiente' },
            { fecha: 'Jue 14', estado: 'pendiente' },
            { fecha: 'Jue 21', estado: 'pendiente' },
            { fecha: 'Jue 28', estado: 'pendiente' },
          ] },
          { mes: 'Junio 2026', dias: [
            { fecha: 'Jue 04', estado: 'pendiente' },
            { fecha: 'Jue 11', estado: 'pendiente' },
            { fecha: 'Jue 18', estado: 'pendiente' },
            { fecha: 'Jue 25', estado: 'pendiente' },
          ] },
          { mes: 'Julio 2026', dias: [
            { fecha: 'Jue 02', estado: 'pendiente' },
          ] },
        ]
      }
    },
  ];

  get promedio(): number {
    return this.notas.reduce((sum, nota) => sum + nota.promedio, 0) / this.notas.length;
  }

  toggleAccordion(index: number): void {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

  verAsistencia(nota: any): void {
    this.cursoSeleccionadoAsistencia = nota;
    this.mostrarAsistencia = true;
  }

  cerrarAsistencia(): void {
    this.mostrarAsistencia = false;
    this.cursoSeleccionadoAsistencia = null;
  }
}
