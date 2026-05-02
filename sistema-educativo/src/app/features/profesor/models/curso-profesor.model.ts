export type EstadoCurso = 'Activo' | 'Inactivo' | 'En revisión';
export type NivelCurso = 'Primaria' | 'Secundaria';

export interface CursoProfesor {
  codigo: string;
  nombre: string;
  area: string;
  nivel: NivelCurso;
  estado: EstadoCurso;
  profesor: string;
  alumnos: number;
  horasSemana: number;
  unidades: number;
  avancePrograma: number;
  promedioNotas: number;
  horarios: string[];
}
