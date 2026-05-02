import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';

// ── Types ──────────────────────────────────────────────────────────────────
export interface ModuloCard {
  label: string;
  icon: string;
  descripcion: string;
  route: string;
  color: string;
}

export interface ResumenDia {
  proximaClase: string;
  aula: string;
  hora: string;
  recordatoriosPendientes: number;
  evaluacionesPorRevisar: number;
  estudiantesEnRiesgo: number;
}

// ── Datos ──────────────────────────────────────────────────────────────────
const MODULOS: ModuloCard[] = [
  {
    label: 'Mis Estudiantes',
    icon: 'bi-people-fill',
    descripcion: 'Consulta el listado, progreso y datos de tus alumnos.',
    route: 'profesor/estudiantes',
    color: 'mod-blue',
  },
  {
    label: 'Asistencia',
    icon: 'bi-check-circle-fill',
    descripcion: 'Registra y revisa la asistencia diaria de cada sección.',
    route: 'profesor/asistencia',
    color: 'mod-green',
  },
  {
    label: 'Calificaciones',
    icon: 'bi-journal-check',
    descripcion: 'Ingresa y gestiona las notas de tus evaluaciones.',
    route: 'profesor/calificaciones',
    color: 'mod-purple',
  },
  {
    label: 'Evaluaciones',
    icon: 'bi-file-earmark-text-fill',
    descripcion: 'Crea, programa y revisa evaluaciones y exámenes.',
    route: 'profesor/evaluacion',
    color: 'mod-orange',
  },
  {
    label: 'Horario',
    icon: 'bi-calendar-week-fill',
    descripcion: 'Consulta tu horario semanal de clases y aulas.',
    route: 'profesor/horario',
    color: 'mod-teal',
  },
  {
    label: 'Reportes',
    icon: 'bi-bar-chart-fill',
    descripcion: 'Genera reportes de rendimiento y asistencia por grupo.',
    route: 'profesor/reportes',
    color: 'mod-indigo',
  },
  {
    label: 'Mi Perfil',
    icon: 'bi-person-circle',
    descripcion: 'Actualiza tus datos personales y seguridad de cuenta.',
    route: 'profesor/perfil',
    color: 'mod-rose',
  },
  {
    label: 'Notificaciones',
    icon: 'bi-bell-fill',
    descripcion: 'Revisa avisos, recordatorios y alertas importantes.',
    route: 'profesor/notificaciones',
    color: 'mod-amber',
  },
];

const RESUMEN: ResumenDia = {
  proximaClase: 'Matemáticas — 1°A',
  aula: 'Aula B-204',
  hora: '08:00 AM',
  recordatoriosPendientes: 3,
  evaluacionesPorRevisar: 5,
  estudiantesEnRiesgo: 2,
};

// ── Frases motivacionales ──────────────────────────────────────────────────
const FRASES = [
  'Organiza tu jornada académica de forma simple y eficiente.',
  'Tu dedicación transforma vidas. ¡Que sea un gran día!',
  'Cada clase es una oportunidad de inspirar a tus estudiantes.',
  'El aprendizaje comienza con una docente comprometida como tú.',
];

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {

  // ── Datos de la profesora ──────────────────────────────────────────────
  readonly profesora = signal({
    nombres: 'María Fernanda',
    apellidos: 'López',
    cargo: 'Profesora',
    especialidad: 'Matemáticas',
    estado: 'Activa',
    codigo: 'DOC-2024-001',
    foto: '',
  });

  readonly modulos  = signal<ModuloCard[]>(MODULOS);
  readonly resumen  = signal<ResumenDia>(RESUMEN);

  // ── Fecha y hora actuales ──────────────────────────────────────────────
  readonly fechaHoy  = computed(() => this._formatFecha());
  readonly horaHoy   = signal(this._formatHora());
  readonly frase     = signal(FRASES[new Date().getDay() % FRASES.length]);

  // ── Saludo según hora ──────────────────────────────────────────────────
  readonly saludo = computed(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Buenos días';
    if (h < 18) return 'Buenas tardes';
    return 'Buenas noches';
  });

  get iniciales(): string {
    const p = this.profesora();
    return (p.nombres[0] ?? '') + (p.apellidos[0] ?? '');
  }

  get nombreCompleto(): string {
    const p = this.profesora();
    return `${p.nombres} ${p.apellidos}`;
  }

  // ── Helpers ───────────────────────────────────────────────────────────
  private _formatFecha(): string {
    const d = new Date(2026, 4, 1);
    const dias = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
    const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    return `${dias[d.getDay()]}, ${d.getDate()} de ${meses[d.getMonth()]} de ${d.getFullYear()}`;
  }

  private _formatHora(): string {
    const d = new Date();
    const h = d.getHours().toString().padStart(2, '0');
    const m = d.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  }
}

