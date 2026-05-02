import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { TitleCasePipe } from '@angular/common';

// ── Types ──────────────────────────────────────────────────────────────────
export type TipoNotif =
  | 'clase' | 'evaluacion' | 'entrega' | 'reunion'
  | 'horario' | 'reporte' | 'institucional';

export type EstadoNotif  = 'nueva' | 'pendiente' | 'atendida';
export type PrioridadNotif = 'alta' | 'media' | 'baja';
export type FiltroNotif  = 'todas' | 'no-leidas' | 'pendientes' | 'atendidas';

export interface Notificacion {
  id: number;
  tipo: TipoNotif;
  titulo: string;
  mensaje: string;
  fecha: string;   // 'YYYY-MM-DD'
  hora: string;    // 'HH:MM'
  estado: EstadoNotif;
  prioridad: PrioridadNotif;
  leida: boolean;
  expandida?: boolean;
}

// ── Mock Data ──────────────────────────────────────────────────────────────
const MOCK: Notificacion[] = [
  {
    id: 1, tipo: 'clase',
    titulo: 'Próxima clase de Matemáticas',
    mensaje: 'Tienes clase de Matemáticas a las 8:00 AM en Aula B-204. Recuerda llevar el material de fracciones.',
    fecha: '2026-05-01', hora: '07:30', estado: 'nueva', prioridad: 'alta', leida: false
  },
  {
    id: 2, tipo: 'evaluacion',
    titulo: 'Evaluaciones pendientes por calificar',
    mensaje: '3 evaluaciones del 2° Bimestre están pendientes de calificación. Fecha límite: 05/05/2026.',
    fecha: '2026-05-01', hora: '08:00', estado: 'pendiente', prioridad: 'alta', leida: false
  },
  {
    id: 3, tipo: 'reunion',
    titulo: 'Reunión docente hoy a las 2:00 PM',
    mensaje: 'Reunión general de docentes en la Sala de Profesores. Tema: planificación del tercer bimestre.',
    fecha: '2026-05-01', hora: '13:45', estado: 'nueva', prioridad: 'alta', leida: false
  },
  {
    id: 4, tipo: 'horario',
    titulo: 'Cambio de aula para 5to A',
    mensaje: 'La clase de 5to A del jueves se traslada al Aula C-101 por mantenimiento en B-204.',
    fecha: '2026-04-30', hora: '16:00', estado: 'pendiente', prioridad: 'media', leida: false
  },
  {
    id: 5, tipo: 'entrega',
    titulo: 'Entregas de trabajos por revisar',
    mensaje: '8 trabajos del grupo de 1°B han sido enviados y están esperando revisión y retroalimentación.',
    fecha: '2026-04-30', hora: '09:15', estado: 'pendiente', prioridad: 'media', leida: true
  },
  {
    id: 6, tipo: 'reporte',
    titulo: 'Reporte mensual pendiente',
    mensaje: 'El reporte de rendimiento de abril debe enviarse antes del 03/05/2026 al área académica.',
    fecha: '2026-04-29', hora: '10:00', estado: 'pendiente', prioridad: 'alta', leida: false
  },
  {
    id: 7, tipo: 'institucional',
    titulo: 'Capacitación docente — inscripción abierta',
    mensaje: 'Están abiertas las inscripciones para el taller "Evaluación formativa en el aula". Cupos limitados.',
    fecha: '2026-04-29', hora: '11:30', estado: 'nueva', prioridad: 'baja', leida: false
  },
  {
    id: 8, tipo: 'clase',
    titulo: 'Material de clase actualizado',
    mensaje: 'El coordinador académico ha compartido nuevos recursos para las clases de Álgebra de 3°A.',
    fecha: '2026-04-28', hora: '14:00', estado: 'atendida', prioridad: 'baja', leida: true
  },
  {
    id: 9, tipo: 'evaluacion',
    titulo: 'Recordatorio: examen parcial 2°A',
    mensaje: 'El examen parcial de 2°A está programado para el 06/05/2026. Confirma el temario con los alumnos.',
    fecha: '2026-04-28', hora: '08:45', estado: 'pendiente', prioridad: 'media', leida: true
  },
  {
    id: 10, tipo: 'institucional',
    titulo: 'Feriado escolar — 8 de mayo',
    mensaje: 'El 8 de mayo no habrá clases por Día del Maestro. Planifica tu semana con esta consideración.',
    fecha: '2026-04-27', hora: '09:00', estado: 'atendida', prioridad: 'baja', leida: true
  },
  {
    id: 11, tipo: 'reunion',
    titulo: 'Junta de padres — 1°A y 1°B',
    mensaje: 'La reunión con padres de familia de 1°A y 1°B será el viernes 09/05 a las 4:00 PM.',
    fecha: '2026-04-27', hora: '15:00', estado: 'nueva', prioridad: 'media', leida: false
  },
  {
    id: 12, tipo: 'horario',
    titulo: 'Horario modificado — semana de exámenes',
    mensaje: 'Durante la semana del 12 al 16 de mayo el horario tendrá bloques de 90 minutos. Revisa el cronograma.',
    fecha: '2026-04-26', hora: '17:00', estado: 'atendida', prioridad: 'media', leida: true
  },
];

@Component({
  selector: 'app-notificaciones',
  imports: [TitleCasePipe],
  templateUrl: './notificaciones.html',
  styleUrl: './notificaciones.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Notificaciones {

  // ── State ──────────────────────────────────────────────────────────────
  private _items   = signal<Notificacion[]>(MOCK.map(n => ({ ...n })));
  filtroActivo     = signal<FiltroNotif>('todas');
  detalleAbierto   = signal<number | null>(null);

  // ── Computed ───────────────────────────────────────────────────────────
  totalNoLeidas = computed(() => this._items().filter(n => !n.leida).length);
  totalPendientes= computed(() => this._items().filter(n => n.estado === 'pendiente').length);
  totalAtendidas = computed(() => this._items().filter(n => n.estado === 'atendida').length);
  totalNuevas    = computed(() => this._items().filter(n => n.estado === 'nueva').length);

  itemsFiltrados = computed(() => {
    const f = this.filtroActivo();
    const list = this._items();
    switch (f) {
      case 'no-leidas':  return list.filter(n => !n.leida);
      case 'pendientes': return list.filter(n => n.estado === 'pendiente');
      case 'atendidas':  return list.filter(n => n.estado === 'atendida');
      default:           return list;
    }
  });

  // ── Filtro ─────────────────────────────────────────────────────────────
  setFiltro(f: FiltroNotif): void {
    this.filtroActivo.set(f);
    this.detalleAbierto.set(null);
  }

  // ── Detalle ────────────────────────────────────────────────────────────
  toggleDetalle(id: number): void {
    this.detalleAbierto.set(this.detalleAbierto() === id ? null : id);
    // marcar como leída al abrir
    this._items.update(list =>
      list.map(n => n.id === id ? { ...n, leida: true } : n)
    );
  }

  // ── Acciones individuales ──────────────────────────────────────────────
  marcarLeida(id: number): void {
    this._items.update(list =>
      list.map(n => n.id === id ? { ...n, leida: true } : n)
    );
  }

  marcarAtendida(id: number): void {
    this._items.update(list =>
      list.map(n => n.id === id ? { ...n, estado: 'atendida', leida: true } : n)
    );
  }

  eliminar(id: number): void {
    if (this.detalleAbierto() === id) this.detalleAbierto.set(null);
    this._items.update(list => list.filter(n => n.id !== id));
  }

  // ── Acciones masivas ───────────────────────────────────────────────────
  marcarTodasLeidas(): void {
    this._items.update(list => list.map(n => ({ ...n, leida: true })));
  }

  eliminarAtendidas(): void {
    this.detalleAbierto.set(null);
    this._items.update(list => list.filter(n => n.estado !== 'atendida'));
  }

  // ── Helpers visuales ──────────────────────────────────────────────────
  tipoIcon(tipo: TipoNotif): string {
    const map: Record<TipoNotif, string> = {
      clase:        'bi-easel2-fill',
      evaluacion:   'bi-clipboard-check-fill',
      entrega:      'bi-box-seam-fill',
      reunion:      'bi-people-fill',
      horario:      'bi-calendar-event-fill',
      reporte:      'bi-bar-chart-fill',
      institucional:'bi-megaphone-fill',
    };
    return map[tipo];
  }

  tipoColor(tipo: TipoNotif): string {
    const map: Record<TipoNotif, string> = {
      clase:        'tc-blue',
      evaluacion:   'tc-purple',
      entrega:      'tc-teal',
      reunion:      'tc-green',
      horario:      'tc-orange',
      reporte:      'tc-indigo',
      institucional:'tc-gray',
    };
    return map[tipo];
  }

  estadoClass(estado: EstadoNotif): string {
    const map: Record<EstadoNotif, string> = {
      nueva:    'es-nueva',
      pendiente:'es-pendiente',
      atendida: 'es-atendida',
    };
    return map[estado];
  }

  prioridadClass(p: PrioridadNotif): string {
    const map: Record<PrioridadNotif, string> = {
      alta:  'pr-alta',
      media: 'pr-media',
      baja:  'pr-baja',
    };
    return map[p];
  }

  formatFecha(fecha: string): string {
    const [y, m, d] = fecha.split('-');
    const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    return `${d} ${meses[parseInt(m) - 1]} ${y}`;
  }

  tiempoRelativo(fecha: string, hora: string): string {
    const now = new Date(2026, 4, 1);  // 01/05/2026
    const then = new Date(`${fecha}T${hora}`);
    const diff = Math.floor((now.getTime() - then.getTime()) / 60000);
    if (diff < 1) return 'Ahora mismo';
    if (diff < 60) return `Hace ${diff} min`;
    if (diff < 1440) return `Hace ${Math.floor(diff / 60)} h`;
    const dias = Math.floor(diff / 1440);
    if (dias === 1) return 'Ayer';
    return `Hace ${dias} días`;
  }
}

