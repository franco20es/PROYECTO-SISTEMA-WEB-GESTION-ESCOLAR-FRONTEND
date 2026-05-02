import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';

export type EstadoCalificacion = 'Excelente' | 'Bueno' | 'Regular' | 'Riesgo';
export type TabDetalle = 'resumen' | 'evaluaciones' | 'observaciones' | 'progreso';

export interface NotasEvaluacion {
  tarea1: number | null;
  tarea2: number | null;
  practica: number | null;
  parcial: number | null;
  final: number | null;
}

export interface HistorialEntry {
  fecha: string;
  evaluacion: string;
  nota: number;
  comentario: string;
}

export interface EstudianteCalificacion {
  id: number;
  codigo: string;
  nombre: string;
  apellido: string;
  curso: string;
  seccion: string;
  materia: string;
  notas: NotasEvaluacion;
  observacion: string;
  historial: HistorialEntry[];
}

interface AlertaCalif {
  tipo: 'riesgo' | 'caida' | 'excelencia';
  mensaje: string;
  estudianteNombre: string;
  estudianteId: number;
  prioridad: 'alta' | 'media' | 'baja';
}

interface EvalItem {
  key: string;
  label: string;
  valor: number;
}

const MOCK_ESTUDIANTES: EstudianteCalificacion[] = [
  {
    id: 1, codigo: 'E001', nombre: 'Ana', apellido: 'García López',
    curso: '3ro Secundaria', seccion: 'A', materia: 'Matemática',
    notas: { tarea1: 18, tarea2: 17, practica: 16, parcial: 17, final: 18 },
    observacion: 'Excelente rendimiento constante. Participa activamente en clase y apoya a sus compañeros.',
    historial: [
      { fecha: '2026-03-15', evaluacion: 'Tarea 1', nota: 18, comentario: 'Muy bien desarrollado' },
      { fecha: '2026-03-28', evaluacion: 'Tarea 2', nota: 17, comentario: 'Buen trabajo' },
      { fecha: '2026-04-10', evaluacion: 'Práctica', nota: 16, comentario: 'Correcto' },
      { fecha: '2026-04-20', evaluacion: 'Parcial', nota: 17, comentario: 'Excelente examen' },
      { fecha: '2026-05-01', evaluacion: 'Final', nota: 18, comentario: 'Sobresaliente' },
    ]
  },
  {
    id: 2, codigo: 'E002', nombre: 'Carlos', apellido: 'Mendoza Ruiz',
    curso: '3ro Secundaria', seccion: 'A', materia: 'Matemática',
    notas: { tarea1: 14, tarea2: 15, practica: 13, parcial: 14, final: 15 },
    observacion: 'Buen desempeño general. Puede mejorar en las prácticas de laboratorio.',
    historial: [
      { fecha: '2026-03-15', evaluacion: 'Tarea 1', nota: 14, comentario: '' },
      { fecha: '2026-03-28', evaluacion: 'Tarea 2', nota: 15, comentario: '' },
      { fecha: '2026-04-10', evaluacion: 'Práctica', nota: 13, comentario: 'Debe practicar más' },
      { fecha: '2026-04-20', evaluacion: 'Parcial', nota: 14, comentario: '' },
      { fecha: '2026-05-01', evaluacion: 'Final', nota: 15, comentario: '' },
    ]
  },
  {
    id: 3, codigo: 'E003', nombre: 'Lucía', apellido: 'Torres Vega',
    curso: '3ro Secundaria', seccion: 'A', materia: 'Matemática',
    notas: { tarea1: 9, tarea2: 8, practica: 10, parcial: 9, final: 8 },
    observacion: 'Necesita refuerzo urgente en álgebra y geometría. Se coordinó con tutora.',
    historial: [
      { fecha: '2026-03-15', evaluacion: 'Tarea 1', nota: 9, comentario: 'Revisar ejercicios' },
      { fecha: '2026-03-28', evaluacion: 'Tarea 2', nota: 8, comentario: 'Necesita apoyo adicional' },
      { fecha: '2026-04-10', evaluacion: 'Práctica', nota: 10, comentario: 'Pequeña mejora' },
      { fecha: '2026-04-20', evaluacion: 'Parcial', nota: 9, comentario: 'Insuficiente' },
      { fecha: '2026-05-01', evaluacion: 'Final', nota: 8, comentario: 'Requiere refuerzo' },
    ]
  },
  {
    id: 4, codigo: 'E004', nombre: 'Diego', apellido: 'Flores Castro',
    curso: '3ro Secundaria', seccion: 'A', materia: 'Matemática',
    notas: { tarea1: 12, tarea2: 11, practica: 13, parcial: 12, final: 11 },
    observacion: 'Rendimiento regular. Debe mejorar su participación en clases.',
    historial: [
      { fecha: '2026-03-15', evaluacion: 'Tarea 1', nota: 12, comentario: '' },
      { fecha: '2026-03-28', evaluacion: 'Tarea 2', nota: 11, comentario: '' },
      { fecha: '2026-04-10', evaluacion: 'Práctica', nota: 13, comentario: '' },
      { fecha: '2026-04-20', evaluacion: 'Parcial', nota: 12, comentario: '' },
      { fecha: '2026-05-01', evaluacion: 'Final', nota: 11, comentario: '' },
    ]
  },
  {
    id: 5, codigo: 'E005', nombre: 'Valeria', apellido: 'Ramírez Pérez',
    curso: '3ro Secundaria', seccion: 'B', materia: 'Matemática',
    notas: { tarea1: 16, tarea2: 17, practica: 15, parcial: 16, final: 17 },
    observacion: 'Muy buena estudiante. Constante y dedicada en todas las evaluaciones.',
    historial: [
      { fecha: '2026-03-15', evaluacion: 'Tarea 1', nota: 16, comentario: '' },
      { fecha: '2026-03-28', evaluacion: 'Tarea 2', nota: 17, comentario: '' },
      { fecha: '2026-04-10', evaluacion: 'Práctica', nota: 15, comentario: '' },
      { fecha: '2026-04-20', evaluacion: 'Parcial', nota: 16, comentario: '' },
      { fecha: '2026-05-01', evaluacion: 'Final', nota: 17, comentario: '' },
    ]
  },
  {
    id: 6, codigo: 'E006', nombre: 'Miguel', apellido: 'Sánchez Lima',
    curso: '3ro Secundaria', seccion: 'B', materia: 'Matemática',
    notas: { tarea1: 10, tarea2: 9, practica: 11, parcial: 10, final: 9 },
    observacion: 'En riesgo de desaprobación. Requiere intervención y comunicación con padres.',
    historial: [
      { fecha: '2026-03-15', evaluacion: 'Tarea 1', nota: 10, comentario: '' },
      { fecha: '2026-03-28', evaluacion: 'Tarea 2', nota: 9, comentario: 'Bajo rendimiento' },
      { fecha: '2026-04-10', evaluacion: 'Práctica', nota: 11, comentario: '' },
      { fecha: '2026-04-20', evaluacion: 'Parcial', nota: 10, comentario: '' },
      { fecha: '2026-05-01', evaluacion: 'Final', nota: 9, comentario: 'Requiere tutoría' },
    ]
  },
  {
    id: 7, codigo: 'E007', nombre: 'Sofía', apellido: 'Herrera Díaz',
    curso: '4to Secundaria', seccion: 'A', materia: 'Física',
    notas: { tarea1: 19, tarea2: 18, practica: 19, parcial: 18, final: 20 },
    observacion: 'Rendimiento excepcional. Candidata a olimpiadas de matemáticas y ciencias.',
    historial: [
      { fecha: '2026-03-15', evaluacion: 'Tarea 1', nota: 19, comentario: 'Perfecto' },
      { fecha: '2026-03-28', evaluacion: 'Tarea 2', nota: 18, comentario: 'Excelente' },
      { fecha: '2026-04-10', evaluacion: 'Práctica', nota: 19, comentario: 'Sobresaliente' },
      { fecha: '2026-04-20', evaluacion: 'Parcial', nota: 18, comentario: 'Muy bien' },
      { fecha: '2026-05-01', evaluacion: 'Final', nota: 20, comentario: 'Nota perfecta' },
    ]
  },
  {
    id: 8, codigo: 'E008', nombre: 'Andrés', apellido: 'Morales Quispe',
    curso: '4to Secundaria', seccion: 'A', materia: 'Física',
    notas: { tarea1: 13, tarea2: 12, practica: 14, parcial: 13, final: 12 },
    observacion: 'Rendimiento regular. Debe esforzarse más en las prácticas de laboratorio.',
    historial: [
      { fecha: '2026-03-15', evaluacion: 'Tarea 1', nota: 13, comentario: '' },
      { fecha: '2026-03-28', evaluacion: 'Tarea 2', nota: 12, comentario: '' },
      { fecha: '2026-04-10', evaluacion: 'Práctica', nota: 14, comentario: '' },
      { fecha: '2026-04-20', evaluacion: 'Parcial', nota: 13, comentario: '' },
      { fecha: '2026-05-01', evaluacion: 'Final', nota: 12, comentario: '' },
    ]
  },
  {
    id: 9, codigo: 'E009', nombre: 'Isabella', apellido: 'Cruz Paredes',
    curso: '4to Secundaria', seccion: 'A', materia: 'Física',
    notas: { tarea1: 7, tarea2: 8, practica: 7, parcial: 8, final: 6 },
    observacion: 'Riesgo académico alto. Se coordinó reunión con padres de familia.',
    historial: [
      { fecha: '2026-03-15', evaluacion: 'Tarea 1', nota: 7, comentario: 'Preocupante' },
      { fecha: '2026-03-28', evaluacion: 'Tarea 2', nota: 8, comentario: '' },
      { fecha: '2026-04-10', evaluacion: 'Práctica', nota: 7, comentario: '' },
      { fecha: '2026-04-20', evaluacion: 'Parcial', nota: 8, comentario: '' },
      { fecha: '2026-05-01', evaluacion: 'Final', nota: 6, comentario: 'Requiere tutoría urgente' },
    ]
  },
  {
    id: 10, codigo: 'E010', nombre: 'Mateo', apellido: 'Vargas Lozano',
    curso: '4to Secundaria', seccion: 'B', materia: 'Física',
    notas: { tarea1: 15, tarea2: 14, practica: 16, parcial: 15, final: 14 },
    observacion: 'Buen desempeño en todas las evaluaciones. Actitud positiva.',
    historial: [
      { fecha: '2026-03-15', evaluacion: 'Tarea 1', nota: 15, comentario: '' },
      { fecha: '2026-03-28', evaluacion: 'Tarea 2', nota: 14, comentario: '' },
      { fecha: '2026-04-10', evaluacion: 'Práctica', nota: 16, comentario: '' },
      { fecha: '2026-04-20', evaluacion: 'Parcial', nota: 15, comentario: '' },
      { fecha: '2026-05-01', evaluacion: 'Final', nota: 14, comentario: '' },
    ]
  },
  {
    id: 11, codigo: 'E011', nombre: 'Camila', apellido: 'Ortega Navarro',
    curso: '5to Secundaria', seccion: 'A', materia: 'Química',
    notas: { tarea1: 17, tarea2: 16, practica: 18, parcial: 17, final: 16 },
    observacion: 'Excelente participación. Destaca en laboratorios de química orgánica.',
    historial: [
      { fecha: '2026-03-15', evaluacion: 'Tarea 1', nota: 17, comentario: '' },
      { fecha: '2026-03-28', evaluacion: 'Tarea 2', nota: 16, comentario: '' },
      { fecha: '2026-04-10', evaluacion: 'Práctica', nota: 18, comentario: 'Destacó en práctica' },
      { fecha: '2026-04-20', evaluacion: 'Parcial', nota: 17, comentario: '' },
      { fecha: '2026-05-01', evaluacion: 'Final', nota: 16, comentario: '' },
    ]
  },
  {
    id: 12, codigo: 'E012', nombre: 'Sebastián', apellido: 'Jiménez Rojas',
    curso: '5to Secundaria', seccion: 'A', materia: 'Química',
    notas: { tarea1: 11, tarea2: 12, practica: 10, parcial: 11, final: 12 },
    observacion: 'Necesita mejorar en reacciones químicas y análisis de laboratorio.',
    historial: [
      { fecha: '2026-03-15', evaluacion: 'Tarea 1', nota: 11, comentario: '' },
      { fecha: '2026-03-28', evaluacion: 'Tarea 2', nota: 12, comentario: '' },
      { fecha: '2026-04-10', evaluacion: 'Práctica', nota: 10, comentario: 'Le cuesta el laboratorio' },
      { fecha: '2026-04-20', evaluacion: 'Parcial', nota: 11, comentario: '' },
      { fecha: '2026-05-01', evaluacion: 'Final', nota: 12, comentario: '' },
    ]
  },
  {
    id: 13, codigo: 'E013', nombre: 'Daniela', apellido: 'Ríos Espinoza',
    curso: '5to Secundaria', seccion: 'A', materia: 'Química',
    notas: { tarea1: 15, tarea2: 16, practica: 14, parcial: 15, final: 16 },
    observacion: 'Buen rendimiento académico y actitud colaborativa en el aula.',
    historial: [
      { fecha: '2026-03-15', evaluacion: 'Tarea 1', nota: 15, comentario: '' },
      { fecha: '2026-03-28', evaluacion: 'Tarea 2', nota: 16, comentario: '' },
      { fecha: '2026-04-10', evaluacion: 'Práctica', nota: 14, comentario: '' },
      { fecha: '2026-04-20', evaluacion: 'Parcial', nota: 15, comentario: '' },
      { fecha: '2026-05-01', evaluacion: 'Final', nota: 16, comentario: '' },
    ]
  },
  {
    id: 14, codigo: 'E014', nombre: 'Fernando', apellido: 'Luna Castillo',
    curso: '5to Secundaria', seccion: 'B', materia: 'Química',
    notas: { tarea1: 10, tarea2: 11, practica: 10, parcial: 10, final: 10 },
    observacion: 'En riesgo académico. Muestra falta de motivación. Se requiere apoyo.',
    historial: [
      { fecha: '2026-03-15', evaluacion: 'Tarea 1', nota: 10, comentario: 'Justo aprobatorio' },
      { fecha: '2026-03-28', evaluacion: 'Tarea 2', nota: 11, comentario: '' },
      { fecha: '2026-04-10', evaluacion: 'Práctica', nota: 10, comentario: '' },
      { fecha: '2026-04-20', evaluacion: 'Parcial', nota: 10, comentario: '' },
      { fecha: '2026-05-01', evaluacion: 'Final', nota: 10, comentario: 'Justo en el límite' },
    ]
  },
];

@Component({
  selector: 'app-calificaciones',
  imports: [],
  templateUrl: './calificaciones.html',
  styleUrl: './calificaciones.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Calificaciones {

  readonly periodos = ['I Bimestre', 'II Bimestre', 'III Bimestre', 'IV Bimestre'];

  // ── State ──────────────────────────────────────────────────────────────────
  private readonly _estudiantes = signal<EstudianteCalificacion[]>(MOCK_ESTUDIANTES);
  readonly busqueda       = signal('');
  readonly filtroCurso    = signal('');
  readonly filtroMateria  = signal('');
  readonly filtroSeccion  = signal('');
  readonly filtroEstado   = signal('');
  readonly filtroPeriodo  = signal('I Bimestre');
  readonly estudianteDetalleId = signal<number | null>(null);
  readonly tabDetalle     = signal<TabDetalle>('resumen');
  readonly editingId      = signal<number | null>(null);
  readonly editBuffer     = signal<NotasEvaluacion>({ tarea1: null, tarea2: null, practica: null, parcial: null, final: null });

  // ── Derived ────────────────────────────────────────────────────────────────
  readonly estudiantesConPromedio = computed(() =>
    this._estudiantes().map(e => ({
      ...e,
      promedio: this.calcularPromedio(e.notas),
      estado: this.getEstado(this.calcularPromedio(e.notas)),
    }))
  );

  readonly cursosDisponibles   = computed(() => [...new Set(this.estudiantesConPromedio().map(e => e.curso))].sort());
  readonly materiasDisponibles = computed(() => [...new Set(this.estudiantesConPromedio().map(e => e.materia))].sort());
  readonly seccionesDisponibles = computed(() => [...new Set(this.estudiantesConPromedio().map(e => e.seccion))].sort());

  readonly estudiantesFiltrados = computed(() => {
    const busq    = this.busqueda().toLowerCase().trim();
    const curso   = this.filtroCurso();
    const materia = this.filtroMateria();
    const seccion = this.filtroSeccion();
    const estado  = this.filtroEstado();
    return this.estudiantesConPromedio().filter(e => {
      if (busq    && !`${e.nombre} ${e.apellido} ${e.codigo}`.toLowerCase().includes(busq)) return false;
      if (curso   && e.curso   !== curso)   return false;
      if (materia && e.materia !== materia) return false;
      if (seccion && e.seccion !== seccion) return false;
      if (estado  && e.estado  !== estado)  return false;
      return true;
    });
  });

  readonly estudiantesFiltradosConRanking = computed(() => {
    const filtered = this.estudiantesFiltrados();
    const sorted = [...filtered]
      .filter(e => e.promedio !== null)
      .sort((a, b) => (b.promedio ?? 0) - (a.promedio ?? 0));
    const rankMap = new Map(sorted.map((e, i) => [e.id, i + 1]));
    return filtered.map(e => ({ ...e, ranking: rankMap.get(e.id) ?? null }));
  });

  readonly stats = computed(() => {
    const list    = this.estudiantesFiltrados();
    const conNota = list.filter(e => e.promedio !== null);
    if (!conNota.length) return { promedioGeneral: 0, notaAlta: 0, notaBaja: 0, aprobados: 0, recuperacion: 0, rendimiento: 0 };
    const promedios      = conNota.map(e => e.promedio as number);
    const promedioGeneral = +(promedios.reduce((a, b) => a + b, 0) / promedios.length).toFixed(1);
    const notaAlta       = +Math.max(...promedios).toFixed(1);
    const notaBaja       = +Math.min(...promedios).toFixed(1);
    const aprobados      = conNota.filter(e => (e.promedio ?? 0) >= 11).length;
    const recuperacion   = conNota.filter(e => (e.promedio ?? 0) < 11).length;
    const rendimiento    = +((aprobados / conNota.length) * 100).toFixed(0);
    return { promedioGeneral, notaAlta, notaBaja, aprobados, recuperacion, rendimiento };
  });

  readonly promediosPorEval = computed(() => {
    const list = this.estudiantesFiltrados();
    const avg = (field: keyof NotasEvaluacion) => {
      const vals = list.map(e => e.notas[field]).filter((v): v is number => v !== null);
      return vals.length ? +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : 0;
    };
    return { tarea1: avg('tarea1'), tarea2: avg('tarea2'), practica: avg('practica'), parcial: avg('parcial'), final: avg('final') };
  });

  readonly evalItems = computed((): EvalItem[] => {
    const p = this.promediosPorEval();
    return [
      { key: 'tarea1',   label: 'Tarea 1',  valor: p.tarea1   },
      { key: 'tarea2',   label: 'Tarea 2',  valor: p.tarea2   },
      { key: 'practica', label: 'Práctica', valor: p.practica },
      { key: 'parcial',  label: 'Parcial',  valor: p.parcial  },
      { key: 'final',    label: 'Final',    valor: p.final    },
    ];
  });

  readonly alertas = computed((): AlertaCalif[] => {
    const result: AlertaCalif[] = [];
    for (const e of this.estudiantesFiltrados()) {
      if (e.estado === 'Riesgo') {
        result.push({ tipo: 'riesgo', mensaje: `Promedio crítico: ${e.promedio?.toFixed(1)}`, estudianteNombre: `${e.nombre} ${e.apellido}`, estudianteId: e.id, prioridad: 'alta' });
      } else if (e.estado === 'Regular' && (e.promedio ?? 20) < 12) {
        result.push({ tipo: 'caida', mensaje: 'Cerca del límite de desaprobación', estudianteNombre: `${e.nombre} ${e.apellido}`, estudianteId: e.id, prioridad: 'media' });
      } else if (e.estado === 'Excelente') {
        result.push({ tipo: 'excelencia', mensaje: `Rendimiento sobresaliente: ${e.promedio?.toFixed(1)}`, estudianteNombre: `${e.nombre} ${e.apellido}`, estudianteId: e.id, prioridad: 'baja' });
      }
    }
    const order: Record<string, number> = { alta: 0, media: 1, baja: 2 };
    return result.sort((a, b) => order[a.prioridad] - order[b.prioridad]);
  });

  readonly previewPromedio = computed(() =>
    this.editingId() !== null ? this.calcularPromedio(this.editBuffer()) : null
  );

  readonly estudianteDetalle = computed(() => {
    const id = this.estudianteDetalleId();
    if (id === null) return null;
    const est = this.estudiantesConPromedio().find(e => e.id === id);
    if (!est) return null;
    const ranking = this.estudiantesFiltradosConRanking().find(r => r.id === id)?.ranking ?? null;
    return { ...est, ranking };
  });

  // ── Helpers ────────────────────────────────────────────────────────────────
  calcularPromedio(notas: NotasEvaluacion): number | null {
    const { tarea1, tarea2, practica, parcial, final } = notas;
    if (tarea1 === null || tarea2 === null || practica === null || parcial === null || final === null) return null;
    return +(tarea1 * 0.1 + tarea2 * 0.1 + practica * 0.2 + parcial * 0.3 + final * 0.3).toFixed(1);
  }

  getEstado(promedio: number | null): EstadoCalificacion | null {
    if (promedio === null) return null;
    if (promedio >= 17) return 'Excelente';
    if (promedio >= 14) return 'Bueno';
    if (promedio >= 11) return 'Regular';
    return 'Riesgo';
  }

  estadoClass(estado: EstadoCalificacion | null | undefined): string {
    if (!estado) return 'chip-sin-nota';
    const map: Record<EstadoCalificacion, string> = { Excelente: 'chip-excelente', Bueno: 'chip-bueno', Regular: 'chip-regular', Riesgo: 'chip-riesgo' };
    return map[estado];
  }

  notaClass(nota: number | null | undefined): string {
    if (nota === null || nota === undefined) return 'nota-null';
    if (nota >= 17) return 'nota-excelente';
    if (nota >= 14) return 'nota-buena';
    if (nota >= 11) return 'nota-regular';
    return 'nota-riesgo';
  }

  alertaClass(tipo: AlertaCalif['tipo']): string {
    return { riesgo: 'alert-riesgo', caida: 'alert-caida', excelencia: 'alert-excelencia' }[tipo];
  }

  formatNota(nota: number | null | undefined): string {
    return nota === null || nota === undefined ? '—' : nota.toFixed(1);
  }

  getBarWidth(nota: number | null | undefined): string {
    if (!nota) return '0%';
    return `${Math.min(100, (nota / 20) * 100)}%`;
  }

  getInitials(nombre: string, apellido: string): string {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
  }

  // ── Actions ────────────────────────────────────────────────────────────────
  iniciarEdicion(id: number): void {
    const est = this._estudiantes().find(e => e.id === id);
    if (!est) return;
    this.editBuffer.set({ ...est.notas });
    this.editingId.set(id);
  }

  guardarEdicion(): void {
    const id = this.editingId();
    if (id === null) return;
    const buf = this.editBuffer();
    this._estudiantes.update(list => list.map(e => e.id === id ? { ...e, notas: { ...buf } } : e));
    this.editingId.set(null);
  }

  cancelarEdicion(): void { this.editingId.set(null); }

  updateBuffer(field: keyof NotasEvaluacion, value: string): void {
    const num  = parseFloat(value);
    const safe = isNaN(num) ? null : +Math.min(20, Math.max(0, num)).toFixed(1);
    this.editBuffer.update(b => ({ ...b, [field]: safe }));
  }

  verDetalle(id: number): void {
    this.estudianteDetalleId.set(id);
    this.tabDetalle.set('resumen');
  }

  cerrarDetalle(): void { this.estudianteDetalleId.set(null); }

  exportarReporte(): void {
    const hdrs = ['Código','Nombre','Apellido','Curso','Sección','Materia','T1','T2','Práctica','Parcial','Final','Promedio','Estado'];
    const rows = this.estudiantesFiltrados().map(e => [
      e.codigo, e.nombre, e.apellido, e.curso, e.seccion, e.materia,
      e.notas.tarea1 ?? '', e.notas.tarea2 ?? '', e.notas.practica ?? '',
      e.notas.parcial ?? '', e.notas.final ?? '', e.promedio ?? '', e.estado ?? ''
    ]);
    const csv  = [hdrs, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = `calificaciones_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  getResumenEvals(notas: NotasEvaluacion): { key: string; label: string; peso: string; valor: number | null }[] {
    return [
      { key: 'tarea1',   label: 'Tarea 1',      peso: '10%', valor: notas.tarea1   },
      { key: 'tarea2',   label: 'Tarea 2',      peso: '10%', valor: notas.tarea2   },
      { key: 'practica', label: 'Práctica',     peso: '20%', valor: notas.practica },
      { key: 'parcial',  label: 'Parcial',      peso: '30%', valor: notas.parcial  },
      { key: 'final',    label: 'Examen Final', peso: '30%', valor: notas.final    },
    ];
  }

  getHistorialBars(historial: HistorialEntry[]): { label: string; nota: number; width: string; clase: string }[] {
    return historial.map(h => ({
      label: h.evaluacion,
      nota: h.nota,
      width: `${(h.nota / 20) * 100}%`,
      clase: this.notaClass(h.nota),
    }));
  }
}
