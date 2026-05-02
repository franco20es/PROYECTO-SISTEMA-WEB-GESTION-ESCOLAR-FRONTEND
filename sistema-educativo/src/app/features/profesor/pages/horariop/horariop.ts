import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

// ── Types ──────────────────────────────────────────────────────────────────
export type TipoBloque = 'Clase' | 'Laboratorio' | 'Reunión' | 'Tutoría' | 'Recreo' | 'Capacitación';
export type EstadoBloque = 'Programada' | 'En curso' | 'Finalizada' | 'Reprogramada' | 'Cancelada';
export type VistaHorario = 'dia' | 'semana' | 'mes';
export type TabDetalle = 'resumen' | 'estudiantes' | 'evaluaciones' | 'recursos';

export interface BloqueHorario {
  id: number;
  dia: number;          // 0=Lunes … 5=Sábado
  horaInicio: string;   // "HH:MM"
  horaFin: string;
  duracionMin: number;
  tipo: TipoBloque;
  estado: EstadoBloque;
  curso: string;
  materia: string;
  seccion: string;
  aula: string;
  piso: string;
  pabellon: string;
  sede: string;
  cantEstudiantes: number;
  modalidad?: 'Presencial' | 'Virtual' | 'Híbrido';
  tema?: string;
  observacion?: string;
  color: string;        // css class suffix: math|science|lang|history|art|lab|meeting
}

export interface EventoEscolar {
  id: number;
  fecha: string;         // "YYYY-MM-DD"
  titulo: string;
  tipo: 'Reunión docente' | 'Capacitación' | 'Examen institucional' | 'Tutoría' | 'Actividad escolar';
  descripcion: string;
  hora?: string;
  lugar?: string;
}

export interface CambioHorario {
  id: number;
  fecha: string;
  tipo: 'Cambio de aula' | 'Reemplazo' | 'Cancelación' | 'Reprogramación';
  descripcion: string;
  estado: 'Pendiente' | 'Aprobado' | 'Rechazado';
}

export interface AlertaHorario {
  id: number;
  tipo: 'proxima' | 'cambio' | 'cancelada' | 'reunion' | 'sustitucion';
  msg: string;
  bloqueId?: number;
}

// ── Mock Data ──────────────────────────────────────────────────────────────
const HORAS_DIA = ['07:00','07:45','08:30','09:15','10:00','10:45','11:30','12:15','13:00','13:45','14:30','15:15','16:00'];

const MOCK_BLOQUES: BloqueHorario[] = [
  // LUNES
  { id:1,  dia:0, horaInicio:'07:45', horaFin:'09:15', duracionMin:90, tipo:'Clase',      estado:'Finalizada',  curso:'3ro Secundaria A', materia:'Matemática',   seccion:'A', aula:'203', piso:'2do', pabellon:'A', sede:'Principal', cantEstudiantes:32, tema:'Matrices y Determinantes',     color:'math',    observacion:'' },
  { id:2,  dia:0, horaInicio:'09:15', horaFin:'10:00', duracionMin:45, tipo:'Recreo',     estado:'Finalizada',  curso:'—',                materia:'—',            seccion:'—', aula:'—',   piso:'—',    pabellon:'—', sede:'—',         cantEstudiantes:0,  tema:'Descanso',                     color:'break',   observacion:'' },
  { id:3,  dia:0, horaInicio:'10:00', horaFin:'11:30', duracionMin:90, tipo:'Clase',      estado:'Finalizada',  curso:'4to Secundaria B', materia:'Física',       seccion:'B', aula:'105', piso:'1ro', pabellon:'B', sede:'Principal', cantEstudiantes:28, tema:'Cinemática - MRUV',            color:'science', observacion:'' },
  { id:4,  dia:0, horaInicio:'11:30', horaFin:'13:00', duracionMin:90, tipo:'Clase',      estado:'Finalizada',  curso:'5to Secundaria C', materia:'Química',      seccion:'C', aula:'301', piso:'3ro', pabellon:'A', sede:'Principal', cantEstudiantes:30, tema:'Química Orgánica — Grupos Funcionales', color:'science', observacion:'' },
  { id:5,  dia:0, horaInicio:'14:30', horaFin:'15:15', duracionMin:45, tipo:'Tutoría',    estado:'Programada',  curso:'3ro Secundaria A', materia:'Tutoría',      seccion:'A', aula:'203', piso:'2do', pabellon:'A', sede:'Principal', cantEstudiantes:32, tema:'Orientación vocacional',       color:'meeting', observacion:'' },
  // MARTES
  { id:6,  dia:1, horaInicio:'07:45', horaFin:'09:15', duracionMin:90, tipo:'Clase',      estado:'Finalizada',  curso:'3ro Secundaria B', materia:'Matemática',   seccion:'B', aula:'204', piso:'2do', pabellon:'A', sede:'Principal', cantEstudiantes:30, tema:'Sistemas de Ecuaciones',       color:'math',    observacion:'' },
  { id:7,  dia:1, horaInicio:'10:00', horaFin:'11:30', duracionMin:90, tipo:'Laboratorio',estado:'Finalizada',  curso:'4to Secundaria B', materia:'Física',       seccion:'B', aula:'Lab1',piso:'1ro', pabellon:'C', sede:'Principal', cantEstudiantes:28, tema:'Práctica: Movimiento libre',   color:'lab',     observacion:'Traer bata y calculadora' },
  { id:8,  dia:1, horaInicio:'13:00', horaFin:'14:30', duracionMin:90, tipo:'Clase',      estado:'Finalizada',  curso:'5to Secundaria C', materia:'Química',      seccion:'C', aula:'301', piso:'3ro', pabellon:'A', sede:'Principal', cantEstudiantes:30, tema:'Reacciones de sustitución',    color:'science', observacion:'' },
  // MIÉRCOLES
  { id:9,  dia:2, horaInicio:'07:45', horaFin:'09:15', duracionMin:90, tipo:'Clase',      estado:'En curso',    curso:'3ro Secundaria A', materia:'Matemática',   seccion:'A', aula:'203', piso:'2do', pabellon:'A', sede:'Principal', cantEstudiantes:32, tema:'Vectores en el plano',         color:'math',    observacion:'' },
  { id:10, dia:2, horaInicio:'10:00', horaFin:'11:30', duracionMin:90, tipo:'Clase',      estado:'Programada',  curso:'4to Secundaria A', materia:'Física',       seccion:'A', aula:'106', piso:'1ro', pabellon:'B', sede:'Principal', cantEstudiantes:29, tema:'Dinámica — Leyes de Newton',   color:'science', observacion:'' },
  { id:11, dia:2, horaInicio:'11:30', horaFin:'13:00', duracionMin:90, tipo:'Clase',      estado:'Programada',  curso:'5to Secundaria C', materia:'Química',      seccion:'C', aula:'301', piso:'3ro', pabellon:'A', sede:'Principal', cantEstudiantes:30, tema:'Estequiometría',               color:'science', observacion:'' },
  { id:12, dia:2, horaInicio:'14:30', horaFin:'16:00', duracionMin:90, tipo:'Reunión',    estado:'Programada',  curso:'—',                materia:'—',            seccion:'—', aula:'Sala Profesores', piso:'1ro', pabellon:'A', sede:'Principal', cantEstudiantes:0, tema:'Reunión de coordinación académica', color:'meeting', observacion:'Llevar notas del trimestre' },
  // JUEVES
  { id:13, dia:3, horaInicio:'07:45', horaFin:'09:15', duracionMin:90, tipo:'Clase',      estado:'Programada',  curso:'3ro Secundaria B', materia:'Matemática',   seccion:'B', aula:'204', piso:'2do', pabellon:'A', sede:'Principal', cantEstudiantes:30, tema:'Geometría analítica',          color:'math',    observacion:'' },
  { id:14, dia:3, horaInicio:'10:00', horaFin:'11:30', duracionMin:90, tipo:'Laboratorio',estado:'Programada',  curso:'5to Secundaria C', materia:'Química',      seccion:'C', aula:'Lab2',piso:'Sótano', pabellon:'C', sede:'Principal', cantEstudiantes:30, tema:'Síntesis orgánica básica',  color:'lab',     observacion:'Usar guantes y gafas de protección' },
  { id:15, dia:3, horaInicio:'13:00', horaFin:'14:30', duracionMin:90, tipo:'Clase',      estado:'Reprogramada',curso:'4to Secundaria A', materia:'Física',       seccion:'A', aula:'107', piso:'1ro', pabellon:'B', sede:'Principal', cantEstudiantes:29, tema:'Trabajo y Energía',            color:'science', observacion:'Aula cambiada de 106 a 107' },
  // VIERNES
  { id:16, dia:4, horaInicio:'07:45', horaFin:'09:15', duracionMin:90, tipo:'Clase',      estado:'Programada',  curso:'3ro Secundaria A', materia:'Matemática',   seccion:'A', aula:'203', piso:'2do', pabellon:'A', sede:'Principal', cantEstudiantes:32, tema:'Trigonometría básica',         color:'math',    observacion:'' },
  { id:17, dia:4, horaInicio:'10:00', horaFin:'11:30', duracionMin:90, tipo:'Clase',      estado:'Programada',  curso:'4to Secundaria B', materia:'Física',       seccion:'B', aula:'105', piso:'1ro', pabellon:'B', sede:'Principal', cantEstudiantes:28, tema:'Oscilaciones y Ondas',         color:'science', observacion:'' },
  { id:18, dia:4, horaInicio:'11:30', horaFin:'12:15', duracionMin:45, tipo:'Tutoría',    estado:'Programada',  curso:'4to Secundaria B', materia:'Tutoría',      seccion:'B', aula:'105', piso:'1ro', pabellon:'B', sede:'Principal', cantEstudiantes:28, tema:'Revisión de resultados',       color:'meeting', observacion:'' },
  { id:19, dia:4, horaInicio:'13:00', horaFin:'14:30', duracionMin:90, tipo:'Clase',      estado:'Cancelada',   curso:'5to Secundaria C', materia:'Química',      seccion:'C', aula:'301', piso:'3ro', pabellon:'A', sede:'Principal', cantEstudiantes:30, tema:'—',                            color:'science', observacion:'Clase cancelada por actividad institucional' },
];

const MOCK_EVENTOS: EventoEscolar[] = [
  { id:1, fecha:'2026-05-06', titulo:'Reunión de Padres de Familia', tipo:'Reunión docente', descripcion:'Reunión informativa del 1er trimestre.', hora:'16:00', lugar:'Auditorio' },
  { id:2, fecha:'2026-05-08', titulo:'Capacitación Docente TIC', tipo:'Capacitación', descripcion:'Taller de herramientas digitales para el aula.', hora:'08:00', lugar:'Sala de Cómputo 2' },
  { id:3, fecha:'2026-05-13', titulo:'Examen Institucional — Matemática', tipo:'Examen institucional', descripcion:'Evaluación trimestral unificada de Matemática.', hora:'07:45', lugar:'Aulas asignadas' },
  { id:4, fecha:'2026-05-15', titulo:'Actividad Día del Maestro', tipo:'Actividad escolar', descripcion:'Celebración institucional del Día del Maestro.', hora:'10:00', lugar:'Patio Central' },
  { id:5, fecha:'2026-05-20', titulo:'Tutoría Grupal — 3ro A', tipo:'Tutoría', descripcion:'Sesión de orientación para el grupo de 3ro A.', hora:'14:30', lugar:'Aula 203' },
  { id:6, fecha:'2026-05-27', titulo:'Reunión de Coordinación', tipo:'Reunión docente', descripcion:'Planificación del 2do trimestre.', hora:'15:00', lugar:'Sala de Profesores' },
];

const MOCK_CAMBIOS: CambioHorario[] = [
  { id:1, fecha:'2026-04-28', tipo:'Cambio de aula',  descripcion:'Clase de Física (4to B) movida de aula 106 a 107 por mantenimiento.', estado:'Aprobado' },
  { id:2, fecha:'2026-04-30', tipo:'Cancelación',     descripcion:'Clase de Química (5to C) del viernes cancelada por actividad institucional.', estado:'Aprobado' },
  { id:3, fecha:'2026-05-01', tipo:'Reemplazo',       descripcion:'Solicitud de reemplazo para el lunes 4 de mayo — Tutoría.', estado:'Pendiente' },
];

const DIAS_SEMANA = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
const DIAS_CORTO  = ['Lun','Mar','Mié','Jue','Vie','Sáb'];

// ── Component ──────────────────────────────────────────────────────────────
@Component({
  selector: 'app-horariop',
  imports: [FormsModule],
  templateUrl: './horariop.html',
  styleUrl: './horariop.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Horariop {

  // ── Constants ────────────────────────────────────────────────────────────
  readonly diasSemana = DIAS_SEMANA;
  readonly diasCorto  = DIAS_CORTO;
  readonly horasDia   = HORAS_DIA;
  readonly tiposBloques: TipoBloque[] = ['Clase','Laboratorio','Reunión','Tutoría','Recreo','Capacitación'];

  // ── State ────────────────────────────────────────────────────────────────
  readonly vista          = signal<VistaHorario>('semana');
  readonly filtroCurso    = signal('');
  readonly filtroMateria  = signal('');
  readonly filtroSeccion  = signal('');
  readonly filtroAula     = signal('');
  readonly diaSeleccionado= signal(2); // miércoles = día actual (mock)
  readonly mesActual      = signal({ anio: 2026, mes: 4 }); // Mayo 2026 (0-indexed)

  readonly bloqueDetalleId= signal<number | null>(null);
  readonly tabDetalle     = signal<TabDetalle>('resumen');

  readonly mostrarSolicitudModal = signal(false);
  readonly tipoSolicitud = signal<'cambio'|'reemplazo'|'conflicto'>('cambio');
  readonly solicitudDesc = signal('');

  readonly mostrarEventoDetalle = signal<EventoEscolar | null>(null);

  private readonly _bloques  = signal<BloqueHorario[]>(MOCK_BLOQUES);
  private readonly _eventos  = signal<EventoEscolar[]>(MOCK_EVENTOS);
  readonly _cambios  = signal<CambioHorario[]>(MOCK_CAMBIOS);

  // ── Computed ─────────────────────────────────────────────────────────────
  readonly cursosDisponibles = computed(() => [...new Set(this._bloques().map(b => b.curso).filter(c => c !== '—'))].sort());
  readonly materiasDisponibles = computed(() => [...new Set(this._bloques().map(b => b.materia).filter(m => m !== '—'))].sort());
  readonly seccionesDisponibles = computed(() => [...new Set(this._bloques().map(b => b.seccion).filter(s => s !== '—'))].sort());
  readonly aulasDisponibles = computed(() => [...new Set(this._bloques().map(b => b.aula).filter(a => a !== '—'))].sort());

  readonly bloquesFiltrados = computed(() => {
    const c = this.filtroCurso();
    const m = this.filtroMateria();
    const s = this.filtroSeccion();
    const a = this.filtroAula();
    return this._bloques().filter(b => {
      if (c && b.curso !== c)    return false;
      if (m && b.materia !== m)  return false;
      if (s && b.seccion !== s)  return false;
      if (a && b.aula !== a)     return false;
      return true;
    });
  });

  readonly bloquesHoy = computed(() =>
    this.bloquesFiltrados().filter(b => b.dia === this.diaSeleccionado() && b.tipo !== 'Recreo')
  );

  readonly bloquesSemanales = computed(() => {
    const grupos: BloqueHorario[][] = Array.from({ length: 6 }, () => []);
    this.bloquesFiltrados().forEach(b => grupos[b.dia].push(b));
    grupos.forEach(g => g.sort((a, b) => a.horaInicio.localeCompare(b.horaInicio)));
    return grupos;
  });

  readonly proximaClase = computed(() => {
    const ahora = '09:00'; // mock "now"
    const hoy = this.diaSeleccionado();
    return this.bloquesFiltrados()
      .filter(b => b.dia === hoy && b.horaInicio > ahora && b.tipo !== 'Recreo' && b.estado !== 'Cancelada')
      .sort((a,b) => a.horaInicio.localeCompare(b.horaInicio))[0] ?? null;
  });

  readonly claseEnCurso = computed(() =>
    this.bloquesFiltrados().find(b => b.estado === 'En curso') ?? null
  );

  readonly statsHoy = computed(() => {
    const hoy = this.bloquesFiltrados().filter(b => b.dia === this.diaSeleccionado());
    const clases    = hoy.filter(b => b.tipo === 'Clase' || b.tipo === 'Laboratorio').length;
    const reuniones = hoy.filter(b => b.tipo === 'Reunión' || b.tipo === 'Tutoría').length;
    const horasLibres = 8 - hoy.filter(b => b.tipo !== 'Recreo').reduce((acc, b) => acc + b.duracionMin / 60, 0);
    return { clases, reuniones, horasLibres: Math.max(0, Math.round(horasLibres * 10)/10) };
  });

  readonly totalHorasSemanales = computed(() => {
    const mins = this.bloquesFiltrados()
      .filter(b => b.tipo !== 'Recreo' && b.tipo !== 'Reunión')
      .reduce((acc, b) => acc + b.duracionMin, 0);
    return Math.round(mins / 60 * 10) / 10;
  });

  readonly alertas = computed((): AlertaHorario[] => {
    const list: AlertaHorario[] = [];
    const prox = this.proximaClase();
    if (prox) list.push({ id:1, tipo:'proxima', msg:`Próxima clase en ~10 min: ${prox.materia} — Aula ${prox.aula}`, bloqueId: prox.id });
    const reprog = this.bloquesFiltrados().find(b => b.estado === 'Reprogramada');
    if (reprog) list.push({ id:2, tipo:'cambio', msg:`Cambio de aula: ${reprog.materia} ahora en Aula ${reprog.aula}`, bloqueId: reprog.id });
    const cancel = this.bloquesFiltrados().find(b => b.estado === 'Cancelada');
    if (cancel) list.push({ id:3, tipo:'cancelada', msg:`Clase cancelada: ${cancel.materia} (${cancel.curso})`, bloqueId: cancel.id });
    const pendiente = this._cambios().find(c => c.estado === 'Pendiente');
    if (pendiente) list.push({ id:4, tipo:'sustitucion', msg:`Solicitud pendiente: ${pendiente.descripcion.substring(0,50)}…` });
    return list;
  });

  readonly bloqueDetalle = computed(() =>
    this.bloqueDetalleId() !== null
      ? this._bloques().find(b => b.id === this.bloqueDetalleId()) ?? null
      : null
  );

  readonly eventosMes = computed(() => {
    const { anio, mes } = this.mesActual();
    return this._eventos().filter(e => {
      const d = new Date(e.fecha);
      return d.getFullYear() === anio && d.getMonth() === mes;
    });
  });

  readonly diasDelMes = computed(() => {
    const { anio, mes } = this.mesActual();
    const total = new Date(anio, mes + 1, 0).getDate();
    const primerDia = new Date(anio, mes, 1).getDay(); // 0=Dom
    const offsetLunes = (primerDia + 6) % 7; // lunes=0
    const celdas: Array<{ dia: number | null; eventos: EventoEscolar[] }> = [];
    for (let i = 0; i < offsetLunes; i++) celdas.push({ dia: null, eventos: [] });
    for (let d = 1; d <= total; d++) {
      const fechaStr = `${anio}-${String(mes+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const evs = this._eventos().filter(e => e.fecha === fechaStr);
      celdas.push({ dia: d, eventos: evs });
    }
    return celdas;
  });

  readonly nombreMes = computed(() => {
    const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    return meses[this.mesActual().mes];
  });

  // ── Methods ───────────────────────────────────────────────────────────────
  verDetalle(id: number) {
    this.bloqueDetalleId.set(id);
    this.tabDetalle.set('resumen');
  }
  cerrarDetalle() { this.bloqueDetalleId.set(null); }

  estadoClass(estado: EstadoBloque): string {
    const m: Record<EstadoBloque, string> = {
      'En curso': 'estado-encurso', 'Programada': 'estado-programada',
      'Finalizada': 'estado-finalizada', 'Reprogramada': 'estado-reprogramada', 'Cancelada': 'estado-cancelada'
    };
    return m[estado] ?? '';
  }

  colorClass(bloque: BloqueHorario): string {
    if (bloque.estado === 'Cancelada')   return 'color-cancelada';
    if (bloque.estado === 'En curso')    return 'color-encurso';
    if (bloque.estado === 'Reprogramada') return 'color-reprogramada';
    return `color-${bloque.color}`;
  }

  tipoIcon(tipo: TipoBloque): string {
    const m: Record<TipoBloque, string> = {
      'Clase':'📚', 'Laboratorio':'🧪', 'Reunión':'👥', 'Tutoría':'🎓', 'Recreo':'☕', 'Capacitación':'💡'
    };
    return m[tipo] ?? '📋';
  }

  alertaClass(tipo: AlertaHorario['tipo']): string {
    const m: Record<string, string> = {
      'proxima':'alerta-proxima', 'cambio':'alerta-cambio', 'cancelada':'alerta-cancelada',
      'reunion':'alerta-reunion', 'sustitucion':'alerta-sustitucion'
    };
    return m[tipo] ?? '';
  }

  eventoTipoIcon(tipo: EventoEscolar['tipo']): string {
    const m: Record<string, string> = {
      'Reunión docente':'👥','Capacitación':'💡','Examen institucional':'📝','Tutoría':'🎓','Actividad escolar':'🎉'
    };
    return m[tipo] ?? '📅';
  }

  getBloquesEnHora(dia: number, hora: string): BloqueHorario[] {
    return this.bloquesFiltrados().filter(b => b.dia === dia && b.horaInicio === hora);
  }

  getTopOffset(horaInicio: string): number {
    const [h, m] = horaInicio.split(':').map(Number);
    const minutos = (h - 7) * 60 + m;
    return Math.round(minutos * 72 / 60); // 72px por hora
  }

  getHeightPx(duracionMin: number): number {
    return Math.round(duracionMin * 72 / 60) - 4;
  }

  formatHora(hora: string): string { return hora; }

  mesAnterior() {
    const { anio, mes } = this.mesActual();
    if (mes === 0) this.mesActual.set({ anio: anio - 1, mes: 11 });
    else this.mesActual.set({ anio, mes: mes - 1 });
  }
  mesSiguiente() {
    const { anio, mes } = this.mesActual();
    if (mes === 11) this.mesActual.set({ anio: anio + 1, mes: 0 });
    else this.mesActual.set({ anio, mes: mes + 1 });
  }

  abrirSolicitud(tipo: 'cambio'|'reemplazo'|'conflicto') {
    this.tipoSolicitud.set(tipo);
    this.solicitudDesc.set('');
    this.mostrarSolicitudModal.set(true);
  }

  enviarSolicitud() {
    if (!this.solicitudDesc().trim()) return;
    const nueva: CambioHorario = {
      id: this._cambios().length + 1,
      fecha: '2026-05-01',
      tipo: this.tipoSolicitud() === 'cambio' ? 'Cambio de aula' : this.tipoSolicitud() === 'reemplazo' ? 'Reemplazo' : 'Reprogramación',
      descripcion: this.solicitudDesc(),
      estado: 'Pendiente'
    };
    this._cambios.update(list => [nueva, ...list]);
    this.mostrarSolicitudModal.set(false);
  }

  getEstudiantesMock(bloque: BloqueHorario): string[] {
    const base = ['Ana García López','Carlos Mendoza Ruiz','Lucía Torres Vega','Diego Flores Castro',
      'Valeria Ramírez Pérez','Sofía Herrera Díaz','Andrés Morales Quispe','Isabella Cruz Paredes',
      'Miguel Sánchez Torres','Camila Ortega Ríos','Sebastián Jiménez Luna','Daniela Ríos Vargas'];
    return base.slice(0, Math.min(bloque.cantEstudiantes, 12));
  }

  getEvaluacionesMock(bloque: BloqueHorario): Array<{titulo:string; fecha:string; tipo:string}> {
    return [
      { titulo: `Tarea — ${bloque.tema ?? bloque.materia}`, fecha: '2026-05-08', tipo: 'Tarea' },
      { titulo: `Práctica Calificada — ${bloque.materia}`,  fecha: '2026-05-15', tipo: 'Práctica' },
    ];
  }

  getRecursosMock(): Array<{nombre:string; tipo:string}> {
    return [
      { nombre: 'Presentación en PPT', tipo: 'ppt' },
      { nombre: 'Guía de ejercicios.pdf', tipo: 'pdf' },
      { nombre: 'Video explicativo', tipo: 'video' },
    ];
  }

  padNum(n: number): string { return String(n).padStart(3,'0'); }

  cambioEstadoClass(estado: CambioHorario['estado']): string {
    const m: Record<string, string> = { 'Aprobado':'chip-aprobado','Pendiente':'chip-pendiente','Rechazado':'chip-rechazado' };
    return m[estado] ?? '';
  }
}

