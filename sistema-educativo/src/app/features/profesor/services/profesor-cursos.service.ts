import { Injectable } from '@angular/core';
import { CursoProfesor } from '../models/curso-profesor.model';

@Injectable({
  providedIn: 'root',
})
export class ProfesorCursosService {
  private readonly cursos: CursoProfesor[] = [
    {
      codigo: 'PRI-MAT-401',
      nombre: 'Matemáticas 4to Primaria',
      area: 'Matemáticas',
      nivel: 'Primaria',
      estado: 'Activo',
      profesor: 'PROF-001',
      alumnos: 30,
      horasSemana: 6,
      unidades: 8,
      avancePrograma: 68,
      promedioNotas: 16.4,
      horarios: ['Lunes 08:00 - 09:30', 'Miércoles 10:00 - 11:30'],
    },
    {
      codigo: 'SEC-COM-201',
      nombre: 'Comunicación 2do Secundaria',
      area: 'Comunicación',
      nivel: 'Secundaria',
      estado: 'Activo',
      profesor: 'PROF-001',
      alumnos: 27,
      horasSemana: 5,
      unidades: 7,
      avancePrograma: 74,
      promedioNotas: 15.9,
      horarios: ['Martes 09:00 - 10:30', 'Jueves 11:00 - 12:30'],
    },
    {
      codigo: 'SEC-CIE-301',
      nombre: 'Ciencias Naturales 3ro Secundaria',
      area: 'Ciencias',
      nivel: 'Secundaria',
      estado: 'En revisión',
      profesor: 'PROF-001',
      alumnos: 25,
      horasSemana: 4,
      unidades: 6,
      avancePrograma: 52,
      promedioNotas: 14.8,
      horarios: ['Lunes 14:00 - 15:30', 'Viernes 08:00 - 09:30'],
    },
    {
      codigo: 'PRI-HIS-501',
      nombre: 'Historia 5to Primaria',
      area: 'Historia',
      nivel: 'Primaria',
      estado: 'Inactivo',
      profesor: 'PROF-001',
      alumnos: 22,
      horasSemana: 3,
      unidades: 5,
      avancePrograma: 100,
      promedioNotas: 17.2,
      horarios: ['Miércoles 08:00 - 09:00', 'Viernes 10:00 - 11:00'],
    },
    {
      codigo: 'SEC-ART-102',
      nombre: 'Arte 1ro Secundaria',
      area: 'Arte',
      nivel: 'Secundaria',
      estado: 'Activo',
      profesor: 'PROF-001',
      alumnos: 29,
      horasSemana: 3,
      unidades: 6,
      avancePrograma: 45,
      promedioNotas: 16.8,
      horarios: ['Martes 14:00 - 15:00', 'Jueves 14:00 - 15:00'],
    },
    {
      codigo: 'PRI-ING-601',
      nombre: 'Inglés 6to Primaria',
      area: 'Inglés',
      nivel: 'Primaria',
      estado: 'En revisión',
      profesor: 'PROF-002',
      alumnos: 28,
      horasSemana: 4,
      unidades: 8,
      avancePrograma: 38,
      promedioNotas: 15.1,
      horarios: ['Lunes 11:00 - 12:00', 'Miércoles 11:00 - 12:00'],
    },
  ];

  getCursosByProfesor(profesorCodigo: string): CursoProfesor[] {
    return this.cursos.filter((curso) => curso.profesor === profesorCodigo);
  }
}
