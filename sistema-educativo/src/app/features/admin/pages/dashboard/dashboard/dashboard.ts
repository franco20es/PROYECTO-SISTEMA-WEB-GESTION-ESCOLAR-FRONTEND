import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export interface KpiCard {
  icon: string;
  color: 'indigo' | 'green' | 'amber' | 'violet' | 'teal' | 'red';
  value: string | number;
  label: string;
  delta: string;
  up: boolean;
  suffix?: string;
}
 
export interface RecentActivity {
  id: number;
  type: 'enrollment' | 'grade' | 'course' | 'alert' | 'event';
  icon: string;
  iconColor: string;
  title: string;
  description: string;
  time: string;
  badge?: string;
  badgeColor?: string;
}
 
export interface TopCourse {
  id: number;
  code: string;
  name: string;
  teacher: string;
  teacherInitials: string;
  teacherGradient: string;
  students: number;
  avgGrade: string;
  gradeClass: 'great' | 'good' | 'avg' | 'low';
  progress: number;
  progressColor: 'indigo' | 'green' | 'amber';
  area: string;
  areaColor: string;
  headerGradient: string;
}
 
export interface UpcomingEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  type: 'exam' | 'meeting' | 'deadline' | 'event';
  color: string;
  bgColor: string;
}
 
export interface GradeDistribution {
  label: string;
  pct: number;
  count: number;
  color: string;
  bgColor: string;
}
 
export interface NavItem {
  icon: string;
  label: string;
  route: string;
  badge?: string | number;
  badgeColor?: string;
  active?: boolean;
}
 
export interface AttendanceDay {
  day: string;
  pct: number;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, OnDestroy {
 
  // ── UI State ────────────────────────────────────────────────────────────
  sidebarOpen   = true;
  notifOpen     = false;
  userMenuOpen  = false;
  currentTime   = '';
  currentDate   = '';
  private timer: ReturnType<typeof setInterval> | null = null;
 
  // ── Navigation ──────────────────────────────────────────────────────────
  readonly navItems: NavItem[] = [
    { icon: 'bi-speedometer2',   label: 'Dashboard',      route: '/admin/dashboard', active: true  },
    { icon: 'bi-book-fill',      label: 'Cursos',         route: '/admin/cursos',    badge: 18 },
    { icon: 'bi-people-fill',    label: 'Estudiantes',    route: '/admin/estudiantes', badge: '1.2k' },
    { icon: 'bi-person-workspace', label: 'Docentes',     route: '/admin/docentes',  badge: 12 },
    { icon: 'bi-calendar3',      label: 'Horarios',       route: '/admin/horarios'                  },
    { icon: 'bi-clipboard-data', label: 'Calificaciones', route: '/admin/notas',     badge: 3, badgeColor: 'amber' },
    { icon: 'bi-megaphone-fill', label: 'Anuncios',       route: '/admin/anuncios',  badge: 2, badgeColor: 'red'   },
    { icon: 'bi-bar-chart-fill', label: 'Reportes',       route: '/admin/reportes'                  },
    { icon: 'bi-gear-fill',      label: 'Configuración',  route: '/admin/config'                    },
  ];
 
  // ── KPI Cards ──────────────────────────────────────────────────────────
  readonly kpis: KpiCard[] = [
    { icon: 'bi-people-fill',      color: 'indigo', value: '1,248', label: 'Estudiantes Activos',  delta: '+11%',  up: true  },
    { icon: 'bi-person-workspace', color: 'green',  value: 12,      label: 'Docentes Asignados',   delta: '+1',    up: true  },
    { icon: 'bi-book-fill',        color: 'amber',  value: 18,      label: 'Cursos Activos',       delta: '+2',    up: true  },
    { icon: 'bi-star-fill',        color: 'violet', value: '15.6',  label: 'Promedio General',     delta: '+0.3',  up: true  },
    { icon: 'bi-check-circle-fill',color: 'teal',   value: '92%',   label: 'Asistencia Promedio',  delta: '+2%',   up: true  },
    { icon: 'bi-exclamation-triangle-fill', color: 'red', value: 7, label: 'Alertas Pendientes',   delta: '-3',    up: true  },
  ];
 
  // ── Grade Distribution ──────────────────────────────────────────────────
  readonly gradeDistribution: GradeDistribution[] = [
    { label: 'AD (18–20)',  pct: 22, count: 274,  color: '#10b981', bgColor: '#d1fae5' },
    { label: 'A  (14–17)', pct: 45, count: 562,  color: '#6366f1', bgColor: '#eef2ff' },
    { label: 'B  (11–13)', pct: 24, count: 300,  color: '#f59e0b', bgColor: '#fef3c7' },
    { label: 'C  (0–10)',  pct: 9,  count: 112,  color: '#ef4444', bgColor: '#fee2e2' },
  ];
 
  // ── Attendance by day ───────────────────────────────────────────────────
  readonly attendanceDays: AttendanceDay[] = [
    { day: 'Lun', pct: 94 },
    { day: 'Mar', pct: 91 },
    { day: 'Mié', pct: 88 },
    { day: 'Jue', pct: 93 },
    { day: 'Vie', pct: 86 },
  ];
 
  // ── Top Courses ────────────────────────────────────────────────────────
  readonly topCourses: TopCourse[] = [
    { id: 1, code: 'COM-301', name: 'Comunicación y Literatura', teacher: 'Prof. Sara Vega',     teacherInitials: 'SV', teacherGradient: 'linear-gradient(135deg,#10b981,#059669)', students: 35, avgGrade: '17.5', gradeClass: 'great', progress: 70,  progressColor: 'green',  area: 'Comunicación', areaColor: 'com',  headerGradient: 'linear-gradient(135deg,#10b981,#059669)' },
    { id: 2, code: 'ING-301', name: 'Inglés Intermedio',        teacher: 'Prof. Mary Wilson',   teacherInitials: 'MW', teacherGradient: 'linear-gradient(135deg,#8b5cf6,#7c3aed)', students: 35, avgGrade: '16.9', gradeClass: 'great', progress: 75,  progressColor: 'green',  area: 'Inglés',       areaColor: 'lang', headerGradient: 'linear-gradient(135deg,#8b5cf6,#6d28d9)' },
    { id: 3, code: 'ART-201', name: 'Educación Artística',      teacher: 'Prof. Carmen Ríos',   teacherInitials: 'CR', teacherGradient: 'linear-gradient(135deg,#ef4444,#dc2626)', students: 30, avgGrade: '19.0', gradeClass: 'great', progress: 80,  progressColor: 'green',  area: 'Arte',         areaColor: 'art',  headerGradient: 'linear-gradient(135deg,#f43f5e,#e11d48)' },
    { id: 4, code: 'MAT-301', name: 'Matemáticas Avanzadas',    teacher: 'Prof. Luis Ramírez',  teacherInitials: 'LR', teacherGradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)', students: 35, avgGrade: '14.2', gradeClass: 'good',  progress: 62,  progressColor: 'indigo', area: 'Matemáticas',  areaColor: 'math', headerGradient: 'linear-gradient(135deg,#6366f1,#4f46e5)' },
    { id: 5, code: 'EFI-401', name: 'Educación Física',         teacher: 'Prof. Gloria Torres', teacherInitials: 'GT', teacherGradient: 'linear-gradient(135deg,#10b981,#14b8a6)', students: 38, avgGrade: '18.5', gradeClass: 'great', progress: 90,  progressColor: 'green',  area: 'Ed. Física',   areaColor: 'com',  headerGradient: 'linear-gradient(135deg,#14b8a6,#0f766e)' },
  ];
 
  // ── Upcoming Events ────────────────────────────────────────────────────
  readonly upcomingEvents: UpcomingEvent[] = [
    { id: 1, title: 'Examen Matemáticas 3° Sec',  date: '20 Jun', time: '8:00 AM',  type: 'exam',     color: '#6366f1', bgColor: '#eef2ff' },
    { id: 2, title: 'Reunión de Docentes',         date: '21 Jun', time: '3:00 PM',  type: 'meeting',  color: '#10b981', bgColor: '#d1fae5' },
    { id: 3, title: 'Entrega de Notas Bimestre 2', date: '23 Jun', time: '12:00 PM', type: 'deadline', color: '#f59e0b', bgColor: '#fef3c7' },
    { id: 4, title: 'Feria de Ciencias',           date: '25 Jun', time: '9:00 AM',  type: 'event',    color: '#06b6d4', bgColor: '#ecfeff' },
    { id: 5, title: 'Examen Comunicación 5° Sec',  date: '27 Jun', time: '7:30 AM',  type: 'exam',     color: '#6366f1', bgColor: '#eef2ff' },
  ];
 
  // ── Recent Activity ────────────────────────────────────────────────────
  readonly recentActivity: RecentActivity[] = [
    { id: 1, type: 'enrollment', icon: 'bi-person-plus-fill',       iconColor: '#6366f1', title: 'Nuevo estudiante matriculado',    description: 'Andrea Quispe → 3° Secundaria',        time: 'Hace 5 min',   badge: 'Nuevo',      badgeColor: 'indigo' },
    { id: 2, type: 'grade',      icon: 'bi-clipboard2-check-fill',  iconColor: '#10b981', title: 'Notas registradas',               description: 'Prof. Sara Vega · Comunicación 3°',    time: 'Hace 18 min',  badge: '35 notas',   badgeColor: 'green'  },
    { id: 3, type: 'alert',      icon: 'bi-exclamation-triangle-fill', iconColor: '#f59e0b', title: 'Asistencia baja detectada',    description: '4 estudiantes < 70% — Matemáticas',    time: 'Hace 32 min',  badge: 'Alerta',     badgeColor: 'amber'  },
    { id: 4, type: 'course',     icon: 'bi-book-fill',              iconColor: '#8b5cf6', title: 'Curso actualizado',              description: 'TEC-101 Tecnología e Informática',     time: 'Hace 1h',      badge: 'Revisión',   badgeColor: 'violet' },
    { id: 5, type: 'enrollment', icon: 'bi-person-plus-fill',       iconColor: '#6366f1', title: '3 estudiantes matriculados',     description: '1° Secundaria — Lista actualizada',    time: 'Hace 2h',      badge: 'Nuevo',      badgeColor: 'indigo' },
    { id: 6, type: 'event',      icon: 'bi-calendar-event-fill',   iconColor: '#06b6d4', title: 'Evento programado',              description: 'Feria de Ciencias — 25 de Junio',      time: 'Hace 3h',      badge: 'Evento',     badgeColor: 'teal'   },
  ];
 
  // ── Notifications ──────────────────────────────────────────────────────
  readonly notifications = [
    { icon: 'bi-exclamation-triangle-fill', color: '#f59e0b', bg: '#fef3c7', title: 'Asistencia baja',       desc: '4 alumnos en riesgo',       time: 'Ahora' },
    { icon: 'bi-clipboard2-check-fill',     color: '#10b981', bg: '#d1fae5', title: 'Notas registradas',     desc: 'Comunicación 3° Sec.',       time: '18 min' },
    { icon: 'bi-person-plus-fill',          color: '#6366f1', bg: '#eef2ff', title: 'Nuevo estudiante',      desc: 'Andrea Quispe matriculada',  time: '1h' },
    { icon: 'bi-calendar-event-fill',       color: '#06b6d4', bg: '#ecfeff', title: 'Feria de Ciencias',     desc: 'Recordatorio: 25 de junio',  time: '3h' },
  ];
 
  // ── Lifecycle ──────────────────────────────────────────────────────────
  constructor(
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
  ) {}
 
  ngOnInit(): void {
    this.updateClock();
    this.timer = setInterval(() => {
      this.updateClock();
      this.cdr.markForCheck();
    }, 60_000);
  }
 
  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }
 
  // ── Clock ──────────────────────────────────────────────────────────────
  private updateClock(): void {
    const now  = new Date();
    this.currentTime = now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
    this.currentDate = now.toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' });
  }
 
  // ── Sidebar ────────────────────────────────────────────────────────────
  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
    this.cdr.markForCheck();
  }
 
  // ── Dropdowns ─────────────────────────────────────────────────────────
  toggleNotif(): void {
    this.notifOpen   = !this.notifOpen;
    this.userMenuOpen = false;
    this.cdr.markForCheck();
  }
 
  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
    this.notifOpen    = false;
    this.cdr.markForCheck();
  }
 
  @HostListener('document:click')
  closeDropdowns(): void {
    this.notifOpen    = false;
    this.userMenuOpen = false;
    this.cdr.markForCheck();
  }
 
  // ── Navigation ─────────────────────────────────────────────────────────
  navigate(route: string): void {
    this.router.navigate([route]);
  }
 
  // ── Helpers ────────────────────────────────────────────────────────────
  getEventIcon(type: string): string {
    const map: Record<string, string> = {
      exam:     'bi-pencil-fill',
      meeting:  'bi-people-fill',
      deadline: 'bi-alarm-fill',
      event:    'bi-star-fill',
    };
    return map[type] ?? 'bi-calendar3';
  }
 
  trackById(_: number, item: { id: number }): number {
    return item.id;
  }
}