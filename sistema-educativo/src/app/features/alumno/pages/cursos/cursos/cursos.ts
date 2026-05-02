import { CommonModule, DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
export interface Curso {
  id: number;
  nombre: string;
  codigo: string;
  profesor: string;
  creditos: number;
  nota: number;
  asistencia: number;
  progreso: number;
  horario: string;
  abrev: string;
  evaluacionesDetalle: { nombre: string; nota: number; peso: number }[];
}

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './cursos.html',
  styleUrl: './cursos.css',
})
export class CursosAlumno {
  cursoSeleccionado: Curso | null = null;

  cursos: Curso[] = [
    {
      id: 1,
      nombre: 'Desarrollo Web',
      codigo: 'CS401',
      profesor: 'Dr. López',
      creditos: 4,
      nota: 16.5,
      asistencia: 90,
      progreso: 70,
      horario: 'Lun/Mié 08:00-10:00',
      abrev: 'DW',
      evaluacionesDetalle: [
        { nombre: 'PC1', peso: 10, nota: 16 },
        { nombre: 'PC2', peso: 10, nota: 17 },
        { nombre: 'Parcial', peso: 30, nota: 15 },
        { nombre: 'Trabajo', peso: 20, nota: 18 }
      ]
    },
    {
      id: 2,
      nombre: 'Base de Datos',
      codigo: 'CS402',
      profesor: 'Mg. Ríos',
      creditos: 3,
      nota: 14.0,
      asistencia: 75,
      progreso: 55,
      horario: 'Mar/Jue 10:30-12:00',
      abrev: 'BD',
      evaluacionesDetalle: [
        { nombre: 'PC1', peso: 10, nota: 14 },
        { nombre: 'Laboratorio', peso: 15, nota: 13 },
        { nombre: 'Parcial', peso: 30, nota: 15 },
        { nombre: 'Práctica', peso: 10, nota: 14 }
      ]
    },
    {
      id: 3,
      nombre: 'Redes',
      codigo: 'CS403',
      profesor: 'Ing. Torres',
      creditos: 3,
      nota: 11.5,
      asistencia: 68,
      progreso: 45,
      horario: 'Vie 14:00-17:00',
      abrev: 'RED',
      evaluacionesDetalle: [
        { nombre: 'PC1', peso: 10, nota: 10 },
        { nombre: 'Laboratorio', peso: 15, nota: 12 },
        { nombre: 'Parcial', peso: 30, nota: 11 },
        { nombre: 'Informe', peso: 10, nota: 13 }
      ]
    },
    {
      id: 4,
      nombre: 'Matemática III',
      codigo: 'MAT201',
      profesor: 'Dr. Vargas',
      creditos: 4,
      nota: 17.0,
      asistencia: 95,
      progreso: 80,
      horario: 'Lun/Mar/Jue 07:00-08:00',
      abrev: 'MAT',
      evaluacionesDetalle: [
        { nombre: 'PC1', peso: 10, nota: 17 },
        { nombre: 'PC2', peso: 10, nota: 18 },
        { nombre: 'Parcial', peso: 30, nota: 17 },
        { nombre: 'PC3', peso: 10, nota: 16 }
      ]
    },
    {
      id: 5,
      nombre: 'IA y Machine Learning',
      codigo: 'CS501',
      profesor: 'Mg. Salas',
      creditos: 4,
      nota: 13.0,
      asistencia: 80,
      progreso: 60,
      horario: 'Mié/Vie 16:00-18:00',
      abrev: 'IA',
      evaluacionesDetalle: [
        { nombre: 'PC1', peso: 10, nota: 13 },
        { nombre: 'Proyecto', peso: 20, nota: 14 },
        { nombre: 'Parcial', peso: 30, nota: 12 },
        { nombre: 'Laboratorio', peso: 15, nota: 13 }
      ]
    },
    {
      id: 6,
      nombre: 'Ética Profesional',
      codigo: 'GEN101',
      profesor: 'Lic. Morales',
      creditos: 2,
      nota: 15.5,
      asistencia: 85,
      progreso: 65,
      horario: 'Sáb 09:00-11:00',
      abrev: 'ÉT',
      evaluacionesDetalle: [
        { nombre: 'Ensayo 1', peso: 20, nota: 15 },
        { nombre: 'Exposición', peso: 30, nota: 16 },
        { nombre: 'Ensayo 2', peso: 20, nota: 15 },
        { nombre: 'Participación', peso: 10, nota: 17 }
      ]
    }
  ];
   
  constructor(private router: Router) {}

  verDetalle(curso: Curso) {
    this.router.navigate(['/alumno/detalle-curso', curso.id]);
  }

}
