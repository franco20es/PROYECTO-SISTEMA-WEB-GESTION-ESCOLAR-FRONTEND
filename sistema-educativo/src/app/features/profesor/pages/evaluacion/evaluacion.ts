import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';

// ── Types ──────────────────────────────────────────────────────────────────
export type TipoEval = 'Tarea' | 'Práctica' | 'Examen' | 'Cuestionario' | 'Foro' | 'Exposición' | 'Proyecto' | 'Laboratorio' | 'Participación';
export type EstadoEval = 'Borrador' | 'Publicada' | 'Activa' | 'Cerrada' | 'Vencida';
export type Modalidad = 'Individual' | 'Grupal';
export type TabDetalle = 'resumen' | 'entregas' | 'calificacion' | 'estadisticas';

export interface Adjunto {
  nombre: string;
  tipo: 'pdf' | 'word' | 'excel' | 'imagen' | 'enlace';
  tamano?: string;
}

export interface CriterioRubrica {
  criterio: string;
  descripcion: string;
  puntaje: number;
}

export interface EntregaEstudiante {
  estudianteId: number;
  nombre: string;
  codigo: string;
  grupoNombre?: string;
  fechaEntrega: string | null;
  estadoEntrega: 'Entregado' | 'Pendiente' | 'Tardío' | 'Sin entregar';
  archivoNombre?: string;
  nota: number | null;
  comentario: string;
  retraso?: number; // días de retraso
}

export interface GrupoEval {
  id: number;
  nombre: string;
  lider: string;
  integrantes: string[];
  estado: 'Activo' | 'Inactivo';
  proyectoAsignado?: string;
}

export interface Evaluacion_ {
  id: number;
  titulo: string;
  descripcion: string;
  instrucciones: string;
  curso: string;
  materia: string;
  tipo: TipoEval;
  modalidad: Modalidad;
  estado: EstadoEval;
  fechaPublicacion: string;
  fechaLimite: string;
  puntajeMaximo: number;
  pesoPorcentual: number;
  permitirTardio: boolean;
  adjuntos: Adjunto[];
  rubrica: CriterioRubrica[];
  entregas: EntregaEstudiante[];
  grupoIds?: number[];
}

// ── Mock data ──────────────────────────────────────────────────────────────
const MOCK_GRUPOS: GrupoEval[] = [
  { id: 1, nombre: 'Equipo Alpha', lider: 'Ana García', integrantes: ['Ana García', 'Carlos Mendoza', 'Lucía Torres'], estado: 'Activo', proyectoAsignado: 'Proyecto de Robótica' },
  { id: 2, nombre: 'Equipo Beta',  lider: 'Valeria Ramírez', integrantes: ['Valeria Ramírez', 'Diego Flores', 'Miguel Sánchez'], estado: 'Activo', proyectoAsignado: 'Experimento Químico' },
  { id: 3, nombre: 'Equipo Gamma', lider: 'Sofía Herrera', integrantes: ['Sofía Herrera', 'Andrés Morales'], estado: 'Inactivo', proyectoAsignado: undefined },
  { id: 4, nombre: 'Equipo Delta', lider: 'Camila Ortega', integrantes: ['Camila Ortega', 'Sebastián Jiménez', 'Daniela Ríos', 'Fernando Luna'], estado: 'Activo', proyectoAsignado: 'Maqueta Arquitectónica' },
];

const MOCK_EVALUACIONES: Evaluacion_[] = [
  {
    id: 1, titulo: 'Tarea N°1 — Álgebra Lineal', descripcion: 'Resolver ejercicios de matrices y determinantes.',
    instrucciones: 'Desarrollar todos los pasos. Presentar en hoja cuadriculada con lápiz. No se aceptan borrones.',
    curso: '3ro Secundaria', materia: 'Matemática', tipo: 'Tarea', modalidad: 'Individual',
    estado: 'Activa', fechaPublicacion: '2026-04-15', fechaLimite: '2026-05-05',
    puntajeMaximo: 20, pesoPorcentual: 10, permitirTardio: true,
    adjuntos: [{ nombre: 'ejercicios_matrices.pdf', tipo: 'pdf', tamano: '245 KB' }],
    rubrica: [
      { criterio: 'Procedimiento', descripcion: 'Muestra pasos ordenados y completos', puntaje: 8 },
      { criterio: 'Resultado', descripcion: 'Respuesta correcta y verificada', puntaje: 8 },
      { criterio: 'Presentación', descripcion: 'Limpieza y orden del trabajo', puntaje: 4 },
    ],
    entregas: [
      { estudianteId: 1, nombre: 'Ana García López', codigo: 'E001', fechaEntrega: '2026-05-03', estadoEntrega: 'Entregado', archivoNombre: 'tarea1_ana.pdf', nota: 18, comentario: 'Excelente desarrollo' },
      { estudianteId: 2, nombre: 'Carlos Mendoza Ruiz', codigo: 'E002', fechaEntrega: '2026-05-05', estadoEntrega: 'Entregado', archivoNombre: 'tarea1_carlos.pdf', nota: 15, comentario: 'Buen trabajo, revisar ejercicio 4' },
      { estudianteId: 3, nombre: 'Lucía Torres Vega', codigo: 'E003', fechaEntrega: null, estadoEntrega: 'Pendiente', nota: null, comentario: '' },
      { estudianteId: 4, nombre: 'Diego Flores Castro', codigo: 'E004', fechaEntrega: '2026-05-07', estadoEntrega: 'Tardío', archivoNombre: 'tarea1_diego.pdf', nota: 12, comentario: 'Entregó 2 días tarde', retraso: 2 },
      { estudianteId: 5, nombre: 'Valeria Ramírez Pérez', codigo: 'E005', fechaEntrega: '2026-05-04', estadoEntrega: 'Entregado', archivoNombre: 'tarea1_valeria.pdf', nota: 17, comentario: 'Muy buena presentación' },
    ]
  },
  {
    id: 2, titulo: 'Práctica Calificada — Cinemática', descripcion: 'Práctica en aula sobre movimiento rectilíneo uniforme y MRUV.',
    instrucciones: 'Duración: 90 minutos. Material permitido: calculadora científica y formulario de una hoja.',
    curso: '4to Secundaria', materia: 'Física', tipo: 'Práctica', modalidad: 'Individual',
    estado: 'Cerrada', fechaPublicacion: '2026-04-20', fechaLimite: '2026-04-25',
    puntajeMaximo: 20, pesoPorcentual: 20, permitirTardio: false,
    adjuntos: [{ nombre: 'formulario_cinematica.pdf', tipo: 'pdf', tamano: '120 KB' }, { nombre: 'practica_v2.docx', tipo: 'word', tamano: '85 KB' }],
    rubrica: [
      { criterio: 'Conceptos', descripcion: 'Identificación correcta de variables', puntaje: 6 },
      { criterio: 'Cálculo', descripcion: 'Aplicación de fórmulas y operaciones', puntaje: 10 },
      { criterio: 'Conclusión', descripcion: 'Análisis y conclusión del problema', puntaje: 4 },
    ],
    entregas: [
      { estudianteId: 7, nombre: 'Sofía Herrera Díaz', codigo: 'E007', fechaEntrega: '2026-04-25', estadoEntrega: 'Entregado', archivoNombre: 'pract_sofia.pdf', nota: 19, comentario: 'Sobresaliente' },
      { estudianteId: 8, nombre: 'Andrés Morales Quispe', codigo: 'E008', fechaEntrega: '2026-04-25', estadoEntrega: 'Entregado', archivoNombre: 'pract_andres.pdf', nota: 13, comentario: 'Revisar sección de conclusiones' },
      { estudianteId: 9, nombre: 'Isabella Cruz Paredes', codigo: 'E009', fechaEntrega: '2026-04-25', estadoEntrega: 'Entregado', archivoNombre: 'pract_isabella.pdf', nota: 8, comentario: 'Necesita refuerzo en cinemática' },
    ]
  },
  {
    id: 3, titulo: 'Proyecto Grupal — Experimento Química Orgánica', descripcion: 'Diseñar y ejecutar un experimento de síntesis orgánica básica.',
    instrucciones: 'Grupos de 3-4 integrantes. Presentar informe escrito y exposición oral de 15 min.',
    curso: '5to Secundaria', materia: 'Química', tipo: 'Proyecto', modalidad: 'Grupal',
    estado: 'Activa', fechaPublicacion: '2026-04-10', fechaLimite: '2026-05-10',
    puntajeMaximo: 20, pesoPorcentual: 30, permitirTardio: false,
    adjuntos: [{ nombre: 'guia_proyecto.pdf', tipo: 'pdf', tamano: '310 KB' }, { nombre: 'rubrica_exposicion.xlsx', tipo: 'excel', tamano: '45 KB' }],
    rubrica: [
      { criterio: 'Informe', descripcion: 'Estructura, fundamentación y resultados', puntaje: 8 },
      { criterio: 'Exposición', descripcion: 'Claridad, dominio y tiempo', puntaje: 6 },
      { criterio: 'Trabajo en equipo', descripcion: 'Participación equitativa del grupo', puntaje: 6 },
    ],
    entregas: [
      { estudianteId: 11, nombre: 'Equipo Beta', codigo: 'G002', grupoNombre: 'Equipo Beta', fechaEntrega: null, estadoEntrega: 'Pendiente', nota: null, comentario: '' },
      { estudianteId: 12, nombre: 'Equipo Delta', codigo: 'G004', grupoNombre: 'Equipo Delta', fechaEntrega: '2026-05-08', estadoEntrega: 'Entregado', archivoNombre: 'proyecto_delta.pdf', nota: 16, comentario: 'Buen experimento, mejorar conclusiones' },
    ],
    grupoIds: [2, 4]
  },
  {
    id: 4, titulo: 'Examen Parcial — Matemática', descripcion: 'Examen parcial del II bimestre sobre funciones y límites.',
    instrucciones: 'Duración: 120 minutos. Solo bolígrafo azul. Prohibido el uso de calculadora.',
    curso: '3ro Secundaria', materia: 'Matemática', tipo: 'Examen', modalidad: 'Individual',
    estado: 'Publicada', fechaPublicacion: '2026-05-01', fechaLimite: '2026-05-12',
    puntajeMaximo: 20, pesoPorcentual: 30, permitirTardio: false,
    adjuntos: [],
    rubrica: [
      { criterio: 'Parte A — Funciones', descripcion: 'Ejercicios de dominio e imagen', puntaje: 8 },
      { criterio: 'Parte B — Límites', descripcion: 'Cálculo de límites algebraicos', puntaje: 8 },
      { criterio: 'Parte C — Aplicación', descripcion: 'Problema de aplicación', puntaje: 4 },
    ],
    entregas: []
  },
  {
    id: 5, titulo: 'Cuestionario — Leyes de Newton', descripcion: 'Cuestionario de 10 preguntas sobre las tres leyes de Newton.',
    instrucciones: 'Completar el cuestionario online antes de la fecha límite. Intento único.',
    curso: '4to Secundaria', materia: 'Física', tipo: 'Cuestionario', modalidad: 'Individual',
    estado: 'Vencida', fechaPublicacion: '2026-04-01', fechaLimite: '2026-04-10',
    puntajeMaximo: 10, pesoPorcentual: 5, permitirTardio: false,
    adjuntos: [{ nombre: 'https://forms.google.com/cuestionario_newton', tipo: 'enlace' }],
    rubrica: [],
    entregas: [
      { estudianteId: 7, nombre: 'Sofía Herrera Díaz', codigo: 'E007', fechaEntrega: '2026-04-09', estadoEntrega: 'Entregado', nota: 10, comentario: '' },
      { estudianteId: 8, nombre: 'Andrés Morales Quispe', codigo: 'E008', fechaEntrega: '2026-04-10', estadoEntrega: 'Entregado', nota: 8, comentario: '' },
      { estudianteId: 9, nombre: 'Isabella Cruz Paredes', codigo: 'E009', fechaEntrega: null, estadoEntrega: 'Sin entregar', nota: null, comentario: '' },
    ]
  },
  {
    id: 6, titulo: 'Laboratorio N°2 — Reacciones Ácido-Base', descripcion: 'Práctica de laboratorio sobre indicadores y escala de pH.',
    instrucciones: 'Usar EPP completo. Completar guía de laboratorio durante la práctica.',
    curso: '5to Secundaria', materia: 'Química', tipo: 'Laboratorio', modalidad: 'Grupal',
    estado: 'Borrador', fechaPublicacion: '2026-05-10', fechaLimite: '2026-05-17',
    puntajeMaximo: 20, pesoPorcentual: 15, permitirTardio: true,
    adjuntos: [{ nombre: 'guia_lab2.pdf', tipo: 'pdf', tamano: '198 KB' }],
    rubrica: [
      { criterio: 'Procedimiento', descripcion: 'Sigue correctamente el protocolo', puntaje: 8 },
      { criterio: 'Observaciones', descripcion: 'Registra con precisión los resultados', puntaje: 7 },
      { criterio: 'Conclusiones', descripcion: 'Análisis correcto del pH observado', puntaje: 5 },
    ],
    entregas: [],
    grupoIds: [1, 3]
  },
];

// ── Component ──────────────────────────────────────────────────────────────
@Component({
  selector: 'app-evaluacion',
  imports: [FormsModule],
  templateUrl: './evaluacion.html',
  styleUrl: './evaluacion.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Evaluacion {

  readonly tipos: TipoEval[] = ['Tarea', 'Práctica', 'Examen', 'Cuestionario', 'Foro', 'Exposición', 'Proyecto', 'Laboratorio', 'Participación'];
  readonly estados: EstadoEval[] = ['Borrador', 'Publicada', 'Activa', 'Cerrada', 'Vencida'];

  // ── State ────────────────────────────────────────────────────────────────
  private readonly _evaluaciones = signal<Evaluacion_[]>(MOCK_EVALUACIONES);
  private readonly _grupos       = signal<GrupoEval[]>(MOCK_GRUPOS);

  readonly busqueda     = signal('');
  readonly filtroCurso  = signal('');
  readonly filtroTipo   = signal('');
  readonly filtroEstado = signal('');
  readonly filtroFecha  = signal('');

  // Panel detalle
  readonly evalDetalleId  = signal<number | null>(null);
  readonly tabDetalle     = signal<TabDetalle>('resumen');
  // Panel formulario
  readonly mostrarForm    = signal(false);
  readonly editandoId     = signal<number | null>(null);
  // Panel grupos
  readonly mostrarGrupos  = signal(false);
  readonly mostrarFormGrupo = signal(false);
  readonly editGrupoId    = signal<number | null>(null);
  // Confirmación eliminar
  readonly confirmDeleteId       = signal<number | null>(null);
  readonly confirmDeleteGrupoId  = signal<number | null>(null);
  // Nota en edición
  readonly editingEntregaId = signal<number | null>(null);
  readonly editNotaBuffer   = signal<number | null>(null);
  readonly editComentBuffer = signal('');

  // ── Form model ───────────────────────────────────────────────────────────
  formEval = {
    titulo: '', descripcion: '', instrucciones: '',
    curso: '', materia: '', tipo: 'Tarea' as TipoEval, modalidad: 'Individual' as Modalidad,
    estado: 'Borrador' as EstadoEval, fechaPublicacion: '', fechaLimite: '',
    puntajeMaximo: 20, pesoPorcentual: 10, permitirTardio: false,
  };

  formGrupo = {
    nombre: '', lider: '', integrantes: '', estado: 'Activo' as 'Activo' | 'Inactivo', proyectoAsignado: ''
  };

  // ── Computed ─────────────────────────────────────────────────────────────
  readonly cursosDisponibles   = computed(() => [...new Set(this._evaluaciones().map(e => e.curso))].sort());
  readonly tiposDisponibles    = computed(() => this.tipos);
  readonly grupos              = computed(() => this._grupos());

  readonly evaluacionesFiltradas = computed(() => {
    const busq   = this.busqueda().toLowerCase().trim();
    const curso  = this.filtroCurso();
    const tipo   = this.filtroTipo();
    const estado = this.filtroEstado();
    const fecha  = this.filtroFecha();
    return this._evaluaciones().filter(e => {
      if (busq   && !e.titulo.toLowerCase().includes(busq) && !e.materia.toLowerCase().includes(busq)) return false;
      if (curso  && e.curso   !== curso)   return false;
      if (tipo   && e.tipo    !== tipo)    return false;
      if (estado && e.estado  !== estado)  return false;
      if (fecha  && e.fechaLimite < fecha) return false;
      return true;
    });
  });

  readonly stats = computed(() => {
    const all = this._evaluaciones();
    const activas     = all.filter(e => e.estado === 'Activa').length;
    const pendRevisar = all.reduce((acc, e) => acc + e.entregas.filter(en => en.estadoEntrega === 'Entregado' && en.nota === null).length, 0);
    const vencidas    = all.filter(e => e.estado === 'Vencida').length;
    const entregadas  = all.reduce((acc, e) => acc + e.entregas.filter(en => en.estadoEntrega === 'Entregado' || en.estadoEntrega === 'Tardío').length, 0);
    const gruposActivos = this._grupos().filter(g => g.estado === 'Activo').length;
    // promedio general
    const notas = all.flatMap(e => e.entregas.map(en => en.nota)).filter((n): n is number => n !== null);
    const promedio = notas.length ? +(notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(1) : 0;
    return { activas, pendRevisar, vencidas, entregadas, promedio, gruposActivos };
  });

  readonly alertas = computed(() => {
    const hoy  = new Date().toISOString().split('T')[0];
    const res: { tipo: 'vencida' | 'proxima' | 'tardia' | 'incompleto'; msg: string; evalId: number }[] = [];
    for (const e of this._evaluaciones()) {
      if (e.estado === 'Vencida') {
        const sinEntregar = e.entregas.filter(en => en.estadoEntrega === 'Sin entregar' || en.estadoEntrega === 'Pendiente').length;
        if (sinEntregar > 0) res.push({ tipo: 'vencida', msg: `${sinEntregar} sin entregar — ${e.titulo}`, evalId: e.id });
      } else if (e.estado === 'Activa') {
        const diff = Math.ceil((new Date(e.fechaLimite).getTime() - new Date(hoy).getTime()) / 86400000);
        if (diff >= 0 && diff <= 3) res.push({ tipo: 'proxima', msg: `Vence en ${diff} día(s) — ${e.titulo}`, evalId: e.id });
        const tardias = e.entregas.filter(en => en.estadoEntrega === 'Tardío').length;
        if (tardias > 0) res.push({ tipo: 'tardia', msg: `${tardias} entrega(s) tardía(s) — ${e.titulo}`, evalId: e.id });
      }
      if (e.modalidad === 'Grupal') {
        const gruposIncomp = (e.grupoIds ?? []).filter(gid => {
          const g = this._grupos().find(gr => gr.id === gid);
          return g && g.estado === 'Inactivo';
        }).length;
        if (gruposIncomp > 0) res.push({ tipo: 'incompleto', msg: `Grupo inactivo en — ${e.titulo}`, evalId: e.id });
      }
    }
    return res.slice(0, 8);
  });

  readonly evalDetalle = computed(() => {
    const id = this.evalDetalleId();
    return id !== null ? this._evaluaciones().find(e => e.id === id) ?? null : null;
  });

  readonly estadisticasDetalle = computed(() => {
    const ev = this.evalDetalle();
    if (!ev) return null;
    const notas  = ev.entregas.map(e => e.nota).filter((n): n is number => n !== null);
    const prom   = notas.length ? +(notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(1) : 0;
    const total  = ev.entregas.length;
    const entregadas = ev.entregas.filter(e => e.estadoEntrega === 'Entregado' || e.estadoEntrega === 'Tardío').length;
    const tardias    = ev.entregas.filter(e => e.estadoEntrega === 'Tardío').length;
    const pendientes = ev.entregas.filter(e => e.estadoEntrega === 'Pendiente' || e.estadoEntrega === 'Sin entregar').length;
    const participacion = total > 0 ? +((entregadas / total) * 100).toFixed(0) : 0;
    return { prom, total, entregadas, tardias, pendientes, participacion };
  });

  // ── CRUD Evaluaciones ────────────────────────────────────────────────────
  abrirFormNueva(): void {
    this.formEval = { titulo: '', descripcion: '', instrucciones: '', curso: '', materia: '', tipo: 'Tarea', modalidad: 'Individual', estado: 'Borrador', fechaPublicacion: '', fechaLimite: '', puntajeMaximo: 20, pesoPorcentual: 10, permitirTardio: false };
    this.editandoId.set(null);
    this.mostrarForm.set(true);
  }

  abrirFormEditar(id: number): void {
    const ev = this._evaluaciones().find(e => e.id === id);
    if (!ev) return;
    this.formEval = { titulo: ev.titulo, descripcion: ev.descripcion, instrucciones: ev.instrucciones, curso: ev.curso, materia: ev.materia, tipo: ev.tipo, modalidad: ev.modalidad, estado: ev.estado, fechaPublicacion: ev.fechaPublicacion, fechaLimite: ev.fechaLimite, puntajeMaximo: ev.puntajeMaximo, pesoPorcentual: ev.pesoPorcentual, permitirTardio: ev.permitirTardio };
    this.editandoId.set(id);
    this.mostrarForm.set(true);
  }

  guardarForm(): void {
    const id = this.editandoId();
    if (id !== null) {
      this._evaluaciones.update(list => list.map(e => e.id === id ? { ...e, ...this.formEval } : e));
    } else {
      const newId = Math.max(0, ...this._evaluaciones().map(e => e.id)) + 1;
      this._evaluaciones.update(list => [...list, { id: newId, ...this.formEval, adjuntos: [], rubrica: [], entregas: [] }]);
    }
    this.mostrarForm.set(false);
  }

  confirmarEliminar(id: number): void { this.confirmDeleteId.set(id); }
  cancelarEliminar(): void { this.confirmDeleteId.set(null); }
  ejecutarEliminar(): void {
    const id = this.confirmDeleteId();
    if (id !== null) this._evaluaciones.update(list => list.filter(e => e.id !== id));
    this.confirmDeleteId.set(null);
    if (this.evalDetalleId() === id) this.evalDetalleId.set(null);
  }

  duplicar(id: number): void {
    const ev = this._evaluaciones().find(e => e.id === id);
    if (!ev) return;
    const newId = Math.max(0, ...this._evaluaciones().map(e => e.id)) + 1;
    this._evaluaciones.update(list => [...list, { ...ev, id: newId, titulo: ev.titulo + ' (copia)', estado: 'Borrador', entregas: [] }]);
  }

  cambiarEstado(id: number, estado: EstadoEval): void {
    this._evaluaciones.update(list => list.map(e => e.id === id ? { ...e, estado } : e));
  }

  verDetalle(id: number): void {
    this.evalDetalleId.set(id);
    this.tabDetalle.set('resumen');
    this.editingEntregaId.set(null);
  }

  cerrarDetalle(): void { this.evalDetalleId.set(null); }

  // ── Calificación inline ──────────────────────────────────────────────────
  iniciarCalificar(estId: number, notaActual: number | null, comentActual: string): void {
    this.editingEntregaId.set(estId);
    this.editNotaBuffer.set(notaActual);
    this.editComentBuffer.set(comentActual);
  }

  guardarCalificacion(evalId: number, estId: number): void {
    this._evaluaciones.update(list => list.map(ev => {
      if (ev.id !== evalId) return ev;
      const maxPts = ev.puntajeMaximo;
      const nota   = Math.min(maxPts, Math.max(0, this.editNotaBuffer() ?? 0));
      return { ...ev, entregas: ev.entregas.map(en => en.estudianteId === estId ? { ...en, nota, comentario: this.editComentBuffer() } : en) };
    }));
    this.editingEntregaId.set(null);
  }

  cancelarCalificacion(): void { this.editingEntregaId.set(null); }

  // ── Grupos ───────────────────────────────────────────────────────────────
  abrirFormGrupo(id?: number): void {
    if (id !== undefined) {
      const g = this._grupos().find(gr => gr.id === id);
      if (!g) return;
      this.formGrupo = { nombre: g.nombre, lider: g.lider, integrantes: g.integrantes.join(', '), estado: g.estado, proyectoAsignado: g.proyectoAsignado ?? '' };
      this.editGrupoId.set(id);
    } else {
      this.formGrupo = { nombre: '', lider: '', integrantes: '', estado: 'Activo', proyectoAsignado: '' };
      this.editGrupoId.set(null);
    }
    this.mostrarFormGrupo.set(true);
  }

  guardarGrupo(): void {
    const id = this.editGrupoId();
    const integrantes = this.formGrupo.integrantes.split(',').map(s => s.trim()).filter(Boolean);
    if (id !== null) {
      this._grupos.update(list => list.map(g => g.id === id ? { ...g, ...this.formGrupo, integrantes } : g));
    } else {
      const newId = Math.max(0, ...this._grupos().map(g => g.id)) + 1;
      this._grupos.update(list => [...list, { id: newId, ...this.formGrupo, integrantes }]);
    }
    this.mostrarFormGrupo.set(false);
  }

  confirmarEliminarGrupo(id: number): void { this.confirmDeleteGrupoId.set(id); }
  cancelarEliminarGrupo(): void { this.confirmDeleteGrupoId.set(null); }
  ejecutarEliminarGrupo(): void {
    const id = this.confirmDeleteGrupoId();
    if (id !== null) this._grupos.update(list => list.filter(g => g.id !== id));
    this.confirmDeleteGrupoId.set(null);
  }

  // ── Helpers ──────────────────────────────────────────────────────────────
  estadoClass(estado: EstadoEval): string {
    const map: Record<EstadoEval, string> = { Activa: 'chip-activa', Publicada: 'chip-publicada', Borrador: 'chip-borrador', Cerrada: 'chip-cerrada', Vencida: 'chip-vencida' };
    return map[estado];
  }

  tipoIcon(tipo: TipoEval): string {
    const map: Record<TipoEval, string> = { Tarea: '📝', Práctica: '🔬', Examen: '📋', Cuestionario: '❓', Foro: '💬', Exposición: '🎤', Proyecto: '🏗️', Laboratorio: '⚗️', Participación: '🙋' };
    return map[tipo];
  }

  entregaClass(estado: EntregaEstudiante['estadoEntrega']): string {
    const map: Record<string, string> = { Entregado: 'chip-entregado', Pendiente: 'chip-pendiente', Tardío: 'chip-tardio', 'Sin entregar': 'chip-sin' };
    return map[estado] ?? '';
  }

  alertaClass(tipo: string): string {
    const map: Record<string, string> = { vencida: 'alerta-vencida', proxima: 'alerta-proxima', tardia: 'alerta-tardia', incompleto: 'alerta-incompleto' };
    return map[tipo] ?? '';
  }

  adjuntoIcon(tipo: Adjunto['tipo']): string {
    const map: Record<string, string> = { pdf: '📄', word: '📝', excel: '📊', imagen: '🖼️', enlace: '🔗' };
    return map[tipo] ?? '📎';
  }

  notaColor(nota: number | null, max: number): string {
    if (nota === null) return 'nota-null';
    const pct = nota / max;
    if (pct >= 0.85) return 'nota-excelente';
    if (pct >= 0.70) return 'nota-buena';
    if (pct >= 0.55) return 'nota-regular';
    return 'nota-riesgo';
  }

  getBarWidth(val: number, max: number): string {
    return `${Math.min(100, (val / max) * 100)}%`;
  }

  diasRestantes(fechaLimite: string): number {
    const hoy  = new Date().toISOString().split('T')[0];
    return Math.ceil((new Date(fechaLimite).getTime() - new Date(hoy).getTime()) / 86400000);
  }

  totalEntregas(ev: Evaluacion_): number { return ev.entregas.length; }
  entregasRealizadas(ev: Evaluacion_): number { return ev.entregas.filter(e => e.estadoEntrega === 'Entregado' || e.estadoEntrega === 'Tardío').length; }
  entregasPendientes(ev: Evaluacion_): number { return ev.entregas.filter(e => e.estadoEntrega === 'Pendiente' || e.estadoEntrega === 'Sin entregar').length; }
  promedioEval(ev: Evaluacion_): string {
    const n = ev.entregas.map(e => e.nota).filter((v): v is number => v !== null);
    return n.length ? (n.reduce((a, b) => a + b, 0) / n.length).toFixed(1) : '—';
  }
}
