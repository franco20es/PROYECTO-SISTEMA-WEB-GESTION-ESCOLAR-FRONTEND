import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

// ── Types ──────────────────────────────────────────────────────────────────
export type TabPrincipal = 'resumen' | 'notas' | 'asistencia' | 'evaluaciones' | 'riesgo' | 'exportaciones';
export type TabDetalle   = 'academico' | 'asistencia' | 'observaciones' | 'recomendaciones';
export type EstadoAcademico = 'Aprobado' | 'En riesgo' | 'Desaprobado' | 'Destacado';
export type NivelRiesgo = 'alto' | 'medio' | 'bajo' | 'ninguno';

export interface NotaEval {
  evaluacion: string;
  tipo: string;
  fecha: string;
  nota: number | null;
  peso: number;
}

export interface HistorialAsistencia {
  fecha: string;
  estado: 'Presente' | 'Ausente' | 'Tardanza' | 'Justificado';
}

export interface Observacion {
  fecha: string;
  texto: string;
  tipo: 'Academica' | 'Conducta' | 'Logro';
}

export interface Estudiante {
  id: number;
  codigo: string;
  nombre: string;
  curso: string;
  seccion: string;
  materia: string;
  promedio: number;
  asistenciaPct: number;
  tardanzas: number;
  faltas: number;
  estado: EstadoAcademico;
  riesgo: NivelRiesgo;
  ultimaEval: string;
  ultimaNota: number | null;
  observacion: string;
  notas: NotaEval[];
  historialAsistencia: HistorialAsistencia[];
  observaciones: Observacion[];
}

export interface ReporteGenerado {
  id: number;
  nombre: string;
  tipo: string;
  fecha: string;
  formato: 'PDF' | 'Excel' | 'Vista';
  tamanio: string;
}

export interface EvolucionPeriodo {
  periodo: string;
  promedio: number;
  asistencia: number;
}

// ── Mock Data ──────────────────────────────────────────────────────────────
const NOTAS_BASE: NotaEval[] = [
  { evaluacion: 'Práctica Calificada 1', tipo: 'Práctica',  fecha: '2026-03-10', nota: 16, peso: 15 },
  { evaluacion: 'Tarea 1',              tipo: 'Tarea',      fecha: '2026-03-17', nota: 18, peso: 10 },
  { evaluacion: 'Examen Parcial',       tipo: 'Examen',     fecha: '2026-03-25', nota: 14, peso: 30 },
  { evaluacion: 'Práctica Calificada 2',tipo: 'Práctica',   fecha: '2026-04-07', nota: 17, peso: 15 },
  { evaluacion: 'Tarea 2',              tipo: 'Tarea',      fecha: '2026-04-14', nota: null, peso: 10 },
  { evaluacion: 'Examen Final',         tipo: 'Examen',     fecha: '2026-04-28', nota: null, peso: 20 },
];

const OBS_BASE: Observacion[] = [
  { fecha: '2026-03-20', texto: 'Participa activamente en clase y demuestra dominio del tema.', tipo: 'Academica' },
  { fecha: '2026-04-05', texto: 'Ha mejorado notablemente en su puntualidad.', tipo: 'Conducta' },
];

const mkNotas = (delta = 0): NotaEval[] =>
  NOTAS_BASE.map(n => ({ ...n, nota: n.nota !== null ? Math.min(20, Math.max(0, n.nota + delta)) : null }));

const mkHistorial = (faltas: number, tardanzas: number): HistorialAsistencia[] => {
  const h: HistorialAsistencia[] = [];
  let f = faltas, t = tardanzas;
  for (let d = 1; d <= 20; d++) {
    const fecha = `2026-04-${String(d).padStart(2,'0')}`;
    if (f > 0 && d % 5 === 0)        { h.push({ fecha, estado: 'Ausente'   }); f--; }
    else if (t > 0 && d % 7 === 0)   { h.push({ fecha, estado: 'Tardanza'  }); t--; }
    else if (d % 11 === 0)            { h.push({ fecha, estado: 'Justificado' }); }
    else                              { h.push({ fecha, estado: 'Presente'  }); }
  }
  return h;
};

const MOCK_ESTUDIANTES: Estudiante[] = [
  { id:1,  codigo:'E001', nombre:'Ana García López',        curso:'3ro Secundaria A', seccion:'A', materia:'Matemática', promedio:17.2, asistenciaPct:96, tardanzas:1, faltas:0, estado:'Destacado',   riesgo:'ninguno', ultimaEval:'Práctica 2', ultimaNota:18, observacion:'Excelente desempeño', notas:mkNotas(2),  historialAsistencia:mkHistorial(0,1), observaciones:OBS_BASE },
  { id:2,  codigo:'E002', nombre:'Carlos Mendoza Ruiz',     curso:'3ro Secundaria A', seccion:'A', materia:'Matemática', promedio:14.5, asistenciaPct:88, tardanzas:3, faltas:2, estado:'Aprobado',    riesgo:'bajo',    ultimaEval:'Práctica 2', ultimaNota:15, observacion:'Buen ritmo',          notas:mkNotas(0),  historialAsistencia:mkHistorial(2,3), observaciones:OBS_BASE },
  { id:3,  codigo:'E003', nombre:'Lucía Torres Vega',       curso:'3ro Secundaria A', seccion:'A', materia:'Matemática', promedio:11.0, asistenciaPct:75, tardanzas:5, faltas:4, estado:'En riesgo',   riesgo:'alto',    ultimaEval:'Práctica 2', ultimaNota:10, observacion:'Requiere apoyo',      notas:mkNotas(-4), historialAsistencia:mkHistorial(4,5), observaciones:OBS_BASE },
  { id:4,  codigo:'E004', nombre:'Diego Flores Castro',     curso:'3ro Secundaria A', seccion:'A', materia:'Matemática', promedio:9.5, asistenciaPct:65, tardanzas:6, faltas:7, estado:'Desaprobado', riesgo:'alto',    ultimaEval:'Práctica 2', ultimaNota:8,  observacion:'En seguimiento',      notas:mkNotas(-6), historialAsistencia:mkHistorial(7,6), observaciones:OBS_BASE },
  { id:5,  codigo:'E005', nombre:'Valeria Ramírez Pérez',   curso:'3ro Secundaria A', seccion:'A', materia:'Matemática', promedio:15.8, asistenciaPct:93, tardanzas:2, faltas:1, estado:'Aprobado',    riesgo:'ninguno', ultimaEval:'Práctica 2', ultimaNota:16, observacion:'Progresa bien',       notas:mkNotas(1),  historialAsistencia:mkHistorial(1,2), observaciones:OBS_BASE },
  { id:6,  codigo:'E006', nombre:'Sofía Herrera Díaz',      curso:'4to Secundaria B', seccion:'B', materia:'Física',     promedio:16.5, asistenciaPct:97, tardanzas:0, faltas:0, estado:'Destacado',   riesgo:'ninguno', ultimaEval:'Examen Parcial', ultimaNota:17, observacion:'Destacada',        notas:mkNotas(2),  historialAsistencia:mkHistorial(0,0), observaciones:OBS_BASE },
  { id:7,  codigo:'E007', nombre:'Andrés Morales Quispe',   curso:'4to Secundaria B', seccion:'B', materia:'Física',     promedio:10.2, asistenciaPct:70, tardanzas:4, faltas:5, estado:'En riesgo',   riesgo:'alto',    ultimaEval:'Examen Parcial', ultimaNota:9,  observacion:'Atención urgente',  notas:mkNotas(-5), historialAsistencia:mkHistorial(5,4), observaciones:OBS_BASE },
  { id:8,  codigo:'E008', nombre:'Isabella Cruz Paredes',   curso:'4to Secundaria B', seccion:'B', materia:'Física',     promedio:13.4, asistenciaPct:85, tardanzas:3, faltas:2, estado:'Aprobado',    riesgo:'bajo',    ultimaEval:'Examen Parcial', ultimaNota:14, observacion:'Estable',          notas:mkNotas(-1), historialAsistencia:mkHistorial(2,3), observaciones:OBS_BASE },
  { id:9,  codigo:'E009', nombre:'Miguel Sánchez Torres',   curso:'5to Secundaria C', seccion:'C', materia:'Química',    promedio:18.0, asistenciaPct:99, tardanzas:0, faltas:0, estado:'Destacado',   riesgo:'ninguno', ultimaEval:'Práctica 2', ultimaNota:19, observacion:'Sobresaliente',      notas:mkNotas(3),  historialAsistencia:mkHistorial(0,0), observaciones:OBS_BASE },
  { id:10, codigo:'E010', nombre:'Camila Ortega Ríos',      curso:'5to Secundaria C', seccion:'C', materia:'Química',    promedio:8.5, asistenciaPct:60, tardanzas:7, faltas:8, estado:'Desaprobado', riesgo:'alto',    ultimaEval:'Práctica 2', ultimaNota:7,  observacion:'Seguimiento urgente', notas:mkNotas(-8), historialAsistencia:mkHistorial(8,7), observaciones:OBS_BASE },
  { id:11, codigo:'E011', nombre:'Sebastián Jiménez Luna',  curso:'5to Secundaria C', seccion:'C', materia:'Química',    promedio:14.0, asistenciaPct:90, tardanzas:2, faltas:1, estado:'Aprobado',    riesgo:'ninguno', ultimaEval:'Práctica 2', ultimaNota:14, observacion:'Regular',            notas:mkNotas(0),  historialAsistencia:mkHistorial(1,2), observaciones:OBS_BASE },
  { id:12, codigo:'E012', nombre:'Daniela Ríos Vargas',     curso:'3ro Secundaria A', seccion:'A', materia:'Matemática', promedio:12.1, asistenciaPct:80, tardanzas:4, faltas:3, estado:'En riesgo',   riesgo:'medio',   ultimaEval:'Práctica 2', ultimaNota:12, observacion:'Mejorar constancia',  notas:mkNotas(-2), historialAsistencia:mkHistorial(3,4), observaciones:OBS_BASE },
];

const MOCK_EVOLUCIONES: EvolucionPeriodo[] = [
  { periodo:'Bim. 1', promedio:14.2, asistencia:91 },
  { periodo:'Bim. 2', promedio:13.8, asistencia:88 },
  { periodo:'Bim. 3', promedio:15.1, asistencia:93 },
  { periodo:'Bim. 4', promedio:14.6, asistencia:90 },
];

const MOCK_REPORTES: ReporteGenerado[] = [
  { id:1, nombre:'Calificaciones 3ro A — Bim. 2',   tipo:'Calificaciones', fecha:'2026-04-15', formato:'PDF',   tamanio:'1.2 MB' },
  { id:2, nombre:'Asistencia General — Abril',       tipo:'Asistencia',     fecha:'2026-04-30', formato:'Excel', tamanio:'480 KB' },
  { id:3, nombre:'Riesgo Académico — Trimestre 1',   tipo:'Riesgo',         fecha:'2026-04-20', formato:'PDF',   tamanio:'870 KB' },
  { id:4, nombre:'Rendimiento Individual — E009',    tipo:'Individual',     fecha:'2026-04-25', formato:'PDF',   tamanio:'540 KB' },
];

// ── Component ──────────────────────────────────────────────────────────────
@Component({
  selector: 'app-reportes',
  imports: [FormsModule],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Reportes {

  // ── Constants ────────────────────────────────────────────────────────────
  readonly periodos  = ['Bimestre 1','Bimestre 2','Bimestre 3','Bimestre 4','Trimestre 1','Trimestre 2','Semestre 1'];
  readonly tiposRep  = ['Calificaciones','Asistencia','Evaluaciones','Individual','Riesgo','General'];
  readonly estadosAc: EstadoAcademico[] = ['Aprobado','En riesgo','Desaprobado','Destacado'];

  // ── State ────────────────────────────────────────────────────────────────
  readonly tabActiva       = signal<TabPrincipal>('resumen');
  readonly tabDetalle      = signal<TabDetalle>('academico');

  readonly filtroCurso     = signal('');
  readonly filtroMateria   = signal('');
  readonly filtroSeccion   = signal('');
  readonly filtroPeriodo   = signal('Bimestre 2');
  readonly filtroTipo      = signal('');
  readonly filtroEstado    = signal('');
  readonly busquedaAlumno  = signal('');

  readonly estudianteDetalleId = signal<number | null>(null);
  readonly mostrarDetalleModal = signal(false);
  readonly nuevaObsTexto   = signal('');
  readonly nuevaObsTipo    = signal<Observacion['tipo']>('Academica');

  readonly ordenCol        = signal<keyof Estudiante>('promedio');
  readonly ordenAsc        = signal(false);

  private readonly _estudiantes = signal<Estudiante[]>(MOCK_ESTUDIANTES);
  readonly _reportes            = signal<ReporteGenerado[]>(MOCK_REPORTES);
  readonly _evoluciones         = signal<EvolucionPeriodo[]>(MOCK_EVOLUCIONES);

  // ── Computed ─────────────────────────────────────────────────────────────
  readonly cursosDisponibles    = computed(() => [...new Set(this._estudiantes().map(e => e.curso))].sort());
  readonly materiasDisponibles  = computed(() => [...new Set(this._estudiantes().map(e => e.materia))].sort());
  readonly seccionesDisponibles = computed(() => [...new Set(this._estudiantes().map(e => e.seccion))].sort());

  readonly estudiantesFiltrados = computed(() => {
    const c = this.filtroCurso();
    const m = this.filtroMateria();
    const s = this.filtroSeccion();
    const st = this.filtroEstado();
    const q = this.busquedaAlumno().toLowerCase().trim();
    const col = this.ordenCol();
    const asc = this.ordenAsc();

    let lista = this._estudiantes().filter(e => {
      if (c  && e.curso    !== c)  return false;
      if (m  && e.materia  !== m)  return false;
      if (s  && e.seccion  !== s)  return false;
      if (st && e.estado   !== st) return false;
      if (q  && !e.nombre.toLowerCase().includes(q) && !e.codigo.toLowerCase().includes(q)) return false;
      return true;
    });

    lista = [...lista].sort((a, b) => {
      const va = a[col]; const vb = b[col];
      if (typeof va === 'number' && typeof vb === 'number') return asc ? va - vb : vb - va;
      return asc
        ? String(va).localeCompare(String(vb))
        : String(vb).localeCompare(String(va));
    });
    return lista;
  });

  readonly promedioGeneral = computed(() => {
    const lst = this.estudiantesFiltrados();
    if (!lst.length) return 0;
    return Math.round(lst.reduce((s, e) => s + e.promedio, 0) / lst.length * 10) / 10;
  });

  readonly asistenciaPromedio = computed(() => {
    const lst = this.estudiantesFiltrados();
    if (!lst.length) return 0;
    return Math.round(lst.reduce((s, e) => s + e.asistenciaPct, 0) / lst.length * 10) / 10;
  });

  readonly enRiesgoCount    = computed(() => this.estudiantesFiltrados().filter(e => e.riesgo === 'alto').length);
  readonly destacadoCount   = computed(() => this.estudiantesFiltrados().filter(e => e.estado === 'Destacado').length);
  readonly desaprobadoCount = computed(() => this.estudiantesFiltrados().filter(e => e.estado === 'Desaprobado').length);
  readonly participacionPct = computed(() => {
    const lst = this.estudiantesFiltrados();
    if (!lst.length) return 0;
    const aprobados = lst.filter(e => e.estado !== 'Desaprobado').length;
    return Math.round(aprobados / lst.length * 100);
  });

  readonly estudianteDetalle = computed(() =>
    this.estudianteDetalleId() !== null
      ? this._estudiantes().find(e => e.id === this.estudianteDetalleId()) ?? null
      : null
  );

  readonly rankingEstudiantes = computed(() =>
    [...this.estudiantesFiltrados()].sort((a, b) => b.promedio - a.promedio)
  );

  readonly distribucionEstados = computed(() => {
    const lst = this.estudiantesFiltrados();
    const total = lst.length || 1;
    const counts: Record<EstadoAcademico, number> = { Aprobado: 0, 'En riesgo': 0, Desaprobado: 0, Destacado: 0 };
    lst.forEach(e => counts[e.estado]++);
    return (Object.entries(counts) as [EstadoAcademico, number][])
      .map(([estado, n]) => ({ estado, n, pct: Math.round(n / total * 100) }));
  });

  readonly promediosPorCurso = computed(() => {
    const map = new Map<string, number[]>();
    this.estudiantesFiltrados().forEach(e => {
      if (!map.has(e.curso)) map.set(e.curso, []);
      map.get(e.curso)!.push(e.promedio);
    });
    return [...map.entries()].map(([curso, notas]) => ({
      curso,
      promedio: Math.round(notas.reduce((s, n) => s + n, 0) / notas.length * 10) / 10
    }));
  });

  // ── Methods ───────────────────────────────────────────────────────────────
  verDetalle(id: number) {
    this.estudianteDetalleId.set(id);
    this.tabDetalle.set('academico');
    this.mostrarDetalleModal.set(true);
  }
  cerrarDetalle() { this.mostrarDetalleModal.set(false); this.estudianteDetalleId.set(null); }

  setOrden(col: keyof Estudiante) {
    if (this.ordenCol() === col) this.ordenAsc.update(v => !v);
    else { this.ordenCol.set(col); this.ordenAsc.set(false); }
  }

  estadoClass(estado: EstadoAcademico): string {
    const m: Record<EstadoAcademico, string> = {
      'Destacado': 'badge-destacado', 'Aprobado': 'badge-aprobado',
      'En riesgo': 'badge-riesgo', 'Desaprobado': 'badge-desaprobado'
    };
    return m[estado] ?? '';
  }

  riesgoClass(riesgo: NivelRiesgo): string {
    return { alto: 'risk-alto', medio: 'risk-medio', bajo: 'risk-bajo', ninguno: 'risk-ninguno' }[riesgo];
  }

  notaClass(nota: number | null): string {
    if (nota === null) return 'nota-pendiente';
    if (nota >= 17) return 'nota-alta';
    if (nota >= 11) return 'nota-media';
    return 'nota-baja';
  }

  asistenciaBar(pct: number): number { return Math.min(100, Math.max(0, pct)); }

  promedioColor(p: number): string {
    if (p >= 15) return 'color-green';
    if (p >= 11) return 'color-blue';
    return 'color-red';
  }

  agregarObservacion(estudiante: Estudiante) {
    if (!this.nuevaObsTexto().trim()) return;
    const obs: Observacion = {
      fecha: '2026-05-01',
      texto: this.nuevaObsTexto().trim(),
      tipo: this.nuevaObsTipo(),
    };
    this._estudiantes.update(lista =>
      lista.map(e => e.id === estudiante.id ? { ...e, observaciones: [obs, ...e.observaciones] } : e)
    );
    this.nuevaObsTexto.set('');
  }

  obsClass(tipo: Observacion['tipo']): string {
    return { 'Academica': 'obs-academica', 'Conducta': 'obs-conducta', 'Logro': 'obs-logro' }[tipo];
  }

  generarReporte(formato: 'PDF' | 'Excel' | 'Vista') {
    const nuevo: ReporteGenerado = {
      id: this._reportes().length + 1,
      nombre: `Reporte ${this.filtroTipo() || 'General'} — ${this.filtroPeriodo() || 'Periodo actual'}`,
      tipo: this.filtroTipo() || 'General',
      fecha: '2026-05-01',
      formato,
      tamanio: formato === 'PDF' ? '1.1 MB' : '550 KB',
    };
    this._reportes.update(r => [nuevo, ...r]);
  }

  barWidth(promedio: number): number { return Math.round(promedio / 20 * 100); }

  sortIcon(col: keyof Estudiante): string {
    if (this.ordenCol() !== col) return '↕';
    return this.ordenAsc() ? '↑' : '↓';
  }

  estadoAsistIcon(e: HistorialAsistencia['estado']): string {
    return { 'Presente': '✅', 'Ausente': '❌', 'Tardanza': '⏰', 'Justificado': '📋' }[e] ?? '—';
  }

  getRecomendaciones(est: Estudiante): string[] {
    const rec: string[] = [];
    if (est.promedio < 11)        rec.push('Refuerzo académico urgente — coordinar con padres de familia.');
    if (est.asistenciaPct < 75)   rec.push('Alta inasistencia — solicitar entrevista con apoderado.');
    if (est.tardanzas > 4)        rec.push('Exceso de tardanzas — intervención de tutoría.');
    if (est.estado === 'Destacado') rec.push('Candidato/a a reconocimiento académico del bimestre.');
    if (est.promedio >= 14 && est.promedio < 16) rec.push('Potencial para mejorar con repaso de temas clave.');
    if (!rec.length) rec.push('Desempeño dentro de los parámetros esperados. Continuar monitoreo.');
    return rec;
  }
}

