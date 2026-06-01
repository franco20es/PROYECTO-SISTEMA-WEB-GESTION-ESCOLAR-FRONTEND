// curso.model.ts

export interface CursoDetalle {
  id: string;
  nombre: string;
  docenteNombre: string;
  horario: string;
  aula: string;
  seccion: string;
  bimestre: string;
  promedio: number;
  asistencia: number;
  avance: number;
  pendientes: number;
  unidades: Unidad[];
  anuncios: Anuncio[];
}

export interface Unidad {
  id: string;
  numero: number;
  nombre: string;
  totalTemas: number;
  totalSesiones: number;
  estado: 'completada' | 'en_curso' | 'bloqueada';
  temas: Tema[];
  materiales: Material[];
  actividades: Actividad[];
  notas: NotaActividad[];
}

export interface Tema {
  id: string;
  nombre: string;
  descripcion: string;
  fecha: string;
  estado: 'completado' | 'en_curso' | 'bloqueado';
}

export interface Material {
  id: string;
  nombre: string;
  tipo: 'pdf' | 'doc' | 'video' | 'link' | 'imagen';
  fecha: string;
  tamanio: string;
  url?: string;
}

export interface Actividad {
  id: string;
  nombre: string;
  tipo: 'tarea' | 'examen' | 'foro' | 'practica';
  fechaLimite: string;
  estado: 'pendiente' | 'entregada' | 'vencida' | 'calificada';
  nota?: number;
  presencial: boolean;
}

export interface NotaActividad {
  nombre: string;
  nota: number | null;
  observacion: string;
}

export interface Anuncio {
  id: string;
  titulo: string;
  cuerpo: string;
  fecha: string;
  fijado: boolean;
}

export interface EntregaTarea {
  actividadId: string;
  comentario?: string;
  archivo?: File;
}