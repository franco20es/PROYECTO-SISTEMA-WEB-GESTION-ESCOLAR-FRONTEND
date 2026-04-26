import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface Course {
  id: number;
  code: string;
  name: string;
  area: string;
  areaColor: string;
  level: string;
  grade: string;
  teacher: string;
  teacherInitials: string;
  teacherGradient: string;
  teacherEmail: string;
  students: number;
  hoursPerWeek: number;
  units: number;
  progress: number;
  progressColor: 'indigo' | 'green' | 'amber';
  avgGrade: string;
  gradeClass: 'great' | 'good' | 'avg' | 'low';
  status: 'Activo' | 'Inactivo' | 'En revisión';
  statusColor: 'green' | 'gray' | 'amber';
  headerGradient: string;
  dotColor: string;
  schedule: string[];
  description: string;
}
 
export interface KpiItem {
  icon: string;
  color: string;
  value: string | number;
  label: string;
  delta: string;
  up: boolean;
}
 
export interface StatusTab {
  label: string;
  value: string;
  color: string;
}
 
export interface WeekDay {
  key: string;
  label: string;
  selected: boolean;
  start: string;
  end: string;
}
 
export interface CourseForm {
  code: string;
  name: string;
  area: string;
  level: string;
  grade: string;
  teacher: string;
  hoursPerWeek: number | null;
  maxStudents: number | null;
  units: number | null;
  status: string;
  description: string;
}
 
export interface GradeDistBar {
  label: string;
  pct: number;
  color: string;
}
@Component({
  selector: 'app-cursos',
  imports: [CommonModule, FormsModule],
  templateUrl: './cursos.html',
  styleUrl: './cursos.css',
})
export class CursosComponent implements OnInit {
 
  // ── UI State ──────────────────────────────────────────────────────────
  viewMode:        'grid' | 'table' = 'grid';
  searchQuery     = '';
  selectedLevel   = '';
  selectedArea    = '';
  selectedStatus  = '';
  showModal       = false;
  showDeleteConfirm = false;
  modalMode: 'create' | 'edit' | 'detail' = 'create';
  selectedCourse: Course | null = null;
  courseToDelete:  Course | null = null;
  currentPage     = 1;
  totalPages      = 3;
  sortField       = '';
  sortAsc         = true;
 
  // ── Filter Options ────────────────────────────────────────────────────
  readonly levels = ['Primaria', 'Secundaria'];
 
  readonly areas  = [
    'Matemáticas', 'Comunicación', 'Ciencias',
    'Historia', 'Inglés', 'Arte', 'Educación Física', 'Tecnología',
  ];
 
  readonly grades = [
    '1° Primaria', '2° Primaria', '3° Primaria', '4° Primaria', '5° Primaria', '6° Primaria',
    '1° Secundaria', '2° Secundaria', '3° Secundaria', '4° Secundaria', '5° Secundaria',
  ];
 
  readonly teachers = [
    'Prof. Luis Ramírez', 'Prof. Sara Vega', 'Prof. Ana Flores',
    'Prof. Juan Paredes', 'Prof. Mary Wilson', 'Prof. Carmen Ríos',
    'Prof. Pedro Castro', 'Prof. Gloria Torres',
  ];
 
  readonly statusTabs: StatusTab[] = [
    { label: 'Todos',       value: '',           color: 'blue'  },
    { label: 'Activos',     value: 'Activo',     color: 'green' },
    { label: 'Inactivos',   value: 'Inactivo',   color: 'gray'  },
    { label: 'En revisión', value: 'En revisión', color: 'amber' },
  ];
 
  // ── KPIs ──────────────────────────────────────────────────────────────
  readonly kpis: KpiItem[] = [
    { icon: 'bi-book-fill',       color: 'indigo', value: 18,      label: 'Cursos Activos',    delta: '+2',    up: true  },
    { icon: 'bi-person-workspace', color: 'violet', value: 12,      label: 'Docentes Asignados', delta: '+1',   up: true  },
    { icon: 'bi-people-fill',     color: 'green',  value: '1,248', label: 'Alumnos Totales',   delta: '+11%',  up: true  },
    { icon: 'bi-star-fill',       color: 'amber',  value: '15.6',  label: 'Promedio General',  delta: '+0.3',  up: true  },
  ];
 
  // ── Week Days (for schedule builder) ──────────────────────────────────
  weekDays: WeekDay[] = [
    { key: 'lun', label: 'Lunes',     selected: false, start: '07:00', end: '08:30' },
    { key: 'mar', label: 'Martes',    selected: false, start: '07:00', end: '08:30' },
    { key: 'mie', label: 'Miércoles', selected: false, start: '07:00', end: '08:30' },
    { key: 'jue', label: 'Jueves',    selected: false, start: '07:00', end: '08:30' },
    { key: 'vie', label: 'Viernes',   selected: false, start: '07:00', end: '08:30' },
  ];
 
  // ── Course Form ───────────────────────────────────────────────────────
  courseForm: CourseForm = this.blankForm();
 
  // ── Grade distribution for detail modal ──────────────────────────────
  readonly gradeDistBars: GradeDistBar[] = [
    { label: 'AD (18–20)', pct: 22, color: '#10b981' },
    { label: 'A  (14–17)', pct: 45, color: '#6366f1' },
    { label: 'B  (11–13)', pct: 24, color: '#f59e0b' },
    { label: 'C  (0–10)',  pct: 9,  color: '#ef4444' },
  ];
 
  // ── Data ──────────────────────────────────────────────────────────────
  readonly allCourses: Course[] = [
    { id: 1,  code: 'MAT-301', name: 'Matemáticas Avanzadas',        area: 'Matemáticas',       areaColor: 'math', level: 'Secundaria', grade: '3° Secundaria', teacher: 'Prof. Luis Ramírez',  teacherInitials: 'LR', teacherGradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)', teacherEmail: 'l.ramirez@edu.pe', students: 35, hoursPerWeek: 5, units: 4, progress: 62, progressColor: 'indigo', avgGrade: '14.2', gradeClass: 'good',  status: 'Activo',     statusColor: 'green', headerGradient: 'linear-gradient(135deg,#6366f1,#4f46e5)', dotColor: '#6366f1', schedule: ['Lun 7:00–8:30', 'Mié 7:00–8:30', 'Vie 7:00–8:30'], description: 'Álgebra, geometría analítica, trigonometría y cálculo diferencial.' },
    { id: 2,  code: 'COM-301', name: 'Comunicación y Literatura',    area: 'Comunicación',       areaColor: 'com',  level: 'Secundaria', grade: '3° Secundaria', teacher: 'Prof. Sara Vega',     teacherInitials: 'SV', teacherGradient: 'linear-gradient(135deg,#10b981,#059669)',  teacherEmail: 's.vega@edu.pe',    students: 35, hoursPerWeek: 4, units: 4, progress: 70, progressColor: 'green',  avgGrade: '17.5', gradeClass: 'great', status: 'Activo',     statusColor: 'green', headerGradient: 'linear-gradient(135deg,#10b981,#059669)',  dotColor: '#10b981', schedule: ['Mar 7:00–8:30', 'Jue 7:00–8:30'], description: 'Comprensión lectora, producción de textos y análisis literario.' },
    { id: 3,  code: 'CIE-301', name: 'Ciencias Naturales',          area: 'Ciencias',           areaColor: 'sci',  level: 'Secundaria', grade: '3° Secundaria', teacher: 'Prof. Ana Flores',    teacherInitials: 'AF', teacherGradient: 'linear-gradient(135deg,#06b6d4,#0284c7)',  teacherEmail: 'a.flores@edu.pe',  students: 35, hoursPerWeek: 4, units: 4, progress: 55, progressColor: 'amber',  avgGrade: '15.8', gradeClass: 'good',  status: 'Activo',     statusColor: 'green', headerGradient: 'linear-gradient(135deg,#06b6d4,#0e7490)',  dotColor: '#06b6d4', schedule: ['Lun 9:00–10:30', 'Jue 9:00–10:30'], description: 'Biología celular, química orgánica y física mecánica.' },
    { id: 4,  code: 'HIS-301', name: 'Historia del Perú',           area: 'Historia',           areaColor: 'hist', level: 'Secundaria', grade: '3° Secundaria', teacher: 'Prof. Juan Paredes',  teacherInitials: 'JP', teacherGradient: 'linear-gradient(135deg,#f59e0b,#d97706)',  teacherEmail: 'j.paredes@edu.pe', students: 35, hoursPerWeek: 3, units: 4, progress: 48, progressColor: 'amber',  avgGrade: '13.1', gradeClass: 'avg',   status: 'Activo',     statusColor: 'green', headerGradient: 'linear-gradient(135deg,#f59e0b,#b45309)',  dotColor: '#f59e0b', schedule: ['Mar 9:00–10:30', 'Vie 9:00–10:30'], description: 'Historia del Perú precolombino, colonial y republicano.' },
    { id: 5,  code: 'ING-301', name: 'Inglés Intermedio',           area: 'Inglés',             areaColor: 'lang', level: 'Secundaria', grade: '3° Secundaria', teacher: 'Prof. Mary Wilson',   teacherInitials: 'MW', teacherGradient: 'linear-gradient(135deg,#8b5cf6,#7c3aed)',  teacherEmail: 'm.wilson@edu.pe',  students: 35, hoursPerWeek: 4, units: 4, progress: 75, progressColor: 'green',  avgGrade: '16.9', gradeClass: 'great', status: 'Activo',     statusColor: 'green', headerGradient: 'linear-gradient(135deg,#8b5cf6,#6d28d9)',  dotColor: '#8b5cf6', schedule: ['Lun 11:00–12:30', 'Mié 11:00–12:30'], description: 'Grammar B1, conversación, writing y comprensión auditiva.' },
    { id: 6,  code: 'ART-201', name: 'Educación Artística',         area: 'Arte',               areaColor: 'art',  level: 'Secundaria', grade: '2° Secundaria', teacher: 'Prof. Carmen Ríos',   teacherInitials: 'CR', teacherGradient: 'linear-gradient(135deg,#ef4444,#dc2626)',  teacherEmail: 'c.rios@edu.pe',    students: 30, hoursPerWeek: 2, units: 3, progress: 80, progressColor: 'green',  avgGrade: '19.0', gradeClass: 'great', status: 'Activo',     statusColor: 'green', headerGradient: 'linear-gradient(135deg,#f43f5e,#e11d48)',  dotColor: '#ef4444', schedule: ['Vie 11:00–13:00'], description: 'Dibujo técnico, pintura, escultura y expresión artística.' },
    { id: 7,  code: 'MAT-201', name: 'Matemáticas II',              area: 'Matemáticas',        areaColor: 'math', level: 'Secundaria', grade: '2° Secundaria', teacher: 'Prof. Luis Ramírez',  teacherInitials: 'LR', teacherGradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)', teacherEmail: 'l.ramirez@edu.pe', students: 32, hoursPerWeek: 5, units: 4, progress: 82, progressColor: 'green',  avgGrade: '15.0', gradeClass: 'good',  status: 'Activo',     statusColor: 'green', headerGradient: 'linear-gradient(135deg,#4338ca,#3730a3)',  dotColor: '#4338ca', schedule: ['Lun 7:00–8:30', 'Mié 7:00–8:30', 'Vie 7:00–8:30'], description: 'Álgebra, funciones, estadística descriptiva.' },
    { id: 8,  code: 'TEC-101', name: 'Tecnología e Informática',    area: 'Tecnología',         areaColor: 'sci',  level: 'Secundaria', grade: '1° Secundaria', teacher: 'Prof. Pedro Castro',  teacherInitials: 'PC', teacherGradient: 'linear-gradient(135deg,#0ea5e9,#0284c7)',  teacherEmail: 'p.castro@edu.pe',  students: 28, hoursPerWeek: 2, units: 3, progress: 35, progressColor: 'amber',  avgGrade: '16.2', gradeClass: 'good',  status: 'En revisión',statusColor: 'amber', headerGradient: 'linear-gradient(135deg,#0ea5e9,#0369a1)',  dotColor: '#0ea5e9', schedule: ['Mié 13:00–15:00'], description: 'Manejo de Office, programación básica y ciudadanía digital.' },
    { id: 9,  code: 'EFI-401', name: 'Educación Física',            area: 'Educación Física',   areaColor: 'com',  level: 'Secundaria', grade: '4° Secundaria', teacher: 'Prof. Gloria Torres', teacherInitials: 'GT', teacherGradient: 'linear-gradient(135deg,#10b981,#14b8a6)',  teacherEmail: 'g.torres@edu.pe',  students: 38, hoursPerWeek: 2, units: 3, progress: 90, progressColor: 'green',  avgGrade: '18.5', gradeClass: 'great', status: 'Activo',     statusColor: 'green', headerGradient: 'linear-gradient(135deg,#14b8a6,#0f766e)',  dotColor: '#14b8a6', schedule: ['Mar 13:00–15:00', 'Jue 13:00–15:00'], description: 'Deportes colectivos, atletismo, gimnasia y salud física.' },
    { id: 10, code: 'COM-501', name: 'Lengua y Comunicación V',     area: 'Comunicación',       areaColor: 'com',  level: 'Secundaria', grade: '5° Secundaria', teacher: 'Prof. Sara Vega',     teacherInitials: 'SV', teacherGradient: 'linear-gradient(135deg,#10b981,#059669)',  teacherEmail: 's.vega@edu.pe',    students: 31, hoursPerWeek: 4, units: 4, progress: 20, progressColor: 'amber',  avgGrade: '17.1', gradeClass: 'great', status: 'Activo',     statusColor: 'green', headerGradient: 'linear-gradient(135deg,#059669,#047857)',  dotColor: '#059669', schedule: ['Lun 9:00–10:30', 'Vie 9:00–10:30'], description: 'Preuniversitario: comprensión de textos, análisis literario.' },
    { id: 11, code: 'HIS-101', name: 'Historia Universal',          area: 'Historia',           areaColor: 'hist', level: 'Secundaria', grade: '1° Secundaria', teacher: 'Prof. Juan Paredes',  teacherInitials: 'JP', teacherGradient: 'linear-gradient(135deg,#f59e0b,#d97706)',  teacherEmail: 'j.paredes@edu.pe', students: 27, hoursPerWeek: 3, units: 3, progress: 40, progressColor: 'amber',  avgGrade: '13.8', gradeClass: 'avg',   status: 'Activo',     statusColor: 'green', headerGradient: 'linear-gradient(135deg,#d97706,#92400e)',  dotColor: '#d97706', schedule: ['Mar 11:00–12:30'], description: 'Civilizaciones antiguas, Edad Media y Renacimiento.' },
    { id: 12, code: 'CIE-101', name: 'Ciencias y Ambiente',        area: 'Ciencias',           areaColor: 'sci',  level: 'Primaria',   grade: '6° Primaria',   teacher: 'Prof. Ana Flores',    teacherInitials: 'AF', teacherGradient: 'linear-gradient(135deg,#06b6d4,#0284c7)',  teacherEmail: 'a.flores@edu.pe',  students: 25, hoursPerWeek: 3, units: 3, progress: 65, progressColor: 'green',  avgGrade: '16.4', gradeClass: 'good',  status: 'Inactivo',   statusColor: 'gray',  headerGradient: 'linear-gradient(135deg,#94a3b8,#64748b)',  dotColor: '#94a3b8', schedule: ['Mié 9:00–10:30'], description: 'Seres vivos, ecosistemas, materia y energía.' },
  ];
 
  courses: Course[] = [...this.allCourses];
  filteredCourses: Course[] = [...this.allCourses];
 
  // ── Computed ──────────────────────────────────────────────────────────
  get totalCourses(): number { return this.allCourses.length; }
 
  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
 
  // ── Lifecycle ─────────────────────────────────────────────────────────
  constructor(
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
  ) {}
 
  ngOnInit(): void {
    this.applyFilters();
  }
 
  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.showDeleteConfirm) { this.showDeleteConfirm = false; this.cdr.markForCheck(); }
    else if (this.showModal) { this.closeModal(); }
  }
 
  // ── Filtering & Sorting ───────────────────────────────────────────────
 
  applyFilters(): void {
    const q    = this.searchQuery.toLowerCase().trim();
    const lvl  = this.selectedLevel;
    const area = this.selectedArea;
    const st   = this.selectedStatus;
 
    this.filteredCourses = this.allCourses.filter(c => {
      const matchSearch = !q || (
        c.name.toLowerCase().includes(q)    ||
        c.code.toLowerCase().includes(q)    ||
        c.teacher.toLowerCase().includes(q) ||
        c.area.toLowerCase().includes(q)
      );
      const matchLevel  = !lvl  || c.level === lvl;
      const matchArea   = !area || c.area === area;
      const matchStatus = !st   || c.status === st;
      return matchSearch && matchLevel && matchArea && matchStatus;
    });
 
    if (this.sortField) this.doSort();
    this.currentPage = 1;
    this.cdr.markForCheck();
  }
 
  setStatus(status: string): void {
    this.selectedStatus = status;
    this.applyFilters();
  }
 
  clearSearch(): void {
    this.searchQuery = '';
    this.applyFilters();
  }
 
  resetFilters(): void {
    this.searchQuery    = '';
    this.selectedLevel  = '';
    this.selectedArea   = '';
    this.selectedStatus = '';
    this.applyFilters();
  }
 
  sortBy(field: keyof Course): void {
    if (this.sortField === field) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortField = field as string;
      this.sortAsc   = true;
    }
    this.doSort();
    this.cdr.markForCheck();
  }
 
  private doSort(): void {
    const f = this.sortField as keyof Course;
    this.filteredCourses = [...this.filteredCourses].sort((a, b) => {
      const av = a[f]; const bv = b[f];
      const cmp = typeof av === 'number' && typeof bv === 'number'
        ? av - bv
        : String(av).localeCompare(String(bv));
      return this.sortAsc ? cmp : -cmp;
    });
  }
 
  getCountByStatus(status: string): number {
    return status
      ? this.allCourses.filter(c => c.status === status).length
      : this.allCourses.length;
  }
 
  trackById(_: number, item: Course): number {
    return item.id;
  }
 
  // ── Modal ─────────────────────────────────────────────────────────────
 
  openModal(mode: 'create' | 'edit' | 'detail', course?: Course | null): void {
    this.modalMode = mode;
    this.showModal = true;
 
    if (mode === 'create') {
      this.courseForm = this.blankForm();
      this.resetWeekDays();
    } else if (course) {
      this.selectedCourse = course;
      if (mode === 'edit') this.fillForm(course);
    }
 
    document.body.style.overflow = 'hidden';
    this.cdr.markForCheck();
  }
 
  closeModal(): void {
    this.showModal      = false;
    this.selectedCourse = null;
    document.body.style.overflow = '';
    this.cdr.markForCheck();
  }
 
  // ── CRUD ──────────────────────────────────────────────────────────────
 
  saveCourse(): void {
    if (!this.isFormValid()) return;
 
    if (this.modalMode === 'create') {
      const newCourse: Course = {
        id:               this.allCourses.length + 1,
        code:             this.courseForm.code,
        name:             this.courseForm.name,
        area:             this.courseForm.area,
        areaColor:        'math',
        level:            this.courseForm.level,
        grade:            this.courseForm.grade,
        teacher:          this.courseForm.teacher,
        teacherInitials:  this.getInitials(this.courseForm.teacher),
        teacherGradient:  'linear-gradient(135deg,#6366f1,#8b5cf6)',
        teacherEmail:     '',
        students:         0,
        hoursPerWeek:     this.courseForm.hoursPerWeek ?? 2,
        units:            this.courseForm.units ?? 4,
        progress:         0,
        progressColor:    'indigo',
        avgGrade:         '—',
        gradeClass:       'good',
        status:           (this.courseForm.status as Course['status']) || 'Activo',
        statusColor:      'green',
        headerGradient:   'linear-gradient(135deg,#6366f1,#4f46e5)',
        dotColor:         '#6366f1',
        schedule:         this.buildSchedule(),
        description:      this.courseForm.description,
      };
      (this.allCourses as Course[]).push(newCourse);
    } else if (this.modalMode === 'edit' && this.selectedCourse) {
      const idx = this.allCourses.findIndex(c => c.id === this.selectedCourse!.id);
      if (idx !== -1) {
        (this.allCourses as Course[])[idx] = {
          ...this.allCourses[idx],
          code:        this.courseForm.code,
          name:        this.courseForm.name,
          area:        this.courseForm.area,
          level:       this.courseForm.level,
          grade:       this.courseForm.grade,
          teacher:     this.courseForm.teacher,
          hoursPerWeek: this.courseForm.hoursPerWeek ?? this.allCourses[idx].hoursPerWeek,
          units:       this.courseForm.units ?? this.allCourses[idx].units,
          status:      (this.courseForm.status as Course['status']),
          description: this.courseForm.description,
          schedule:    this.buildSchedule(),
        };
      }
    }
 
    this.applyFilters();
    this.closeModal();
  }
 
  confirmDelete(course: Course): void {
    this.courseToDelete   = course;
    this.showDeleteConfirm = true;
    this.cdr.markForCheck();
  }
 
  deleteCourse(): void {
    if (!this.courseToDelete) return;
    const idx = this.allCourses.findIndex(c => c.id === this.courseToDelete!.id);
    if (idx !== -1) (this.allCourses as Course[]).splice(idx, 1);
    this.courseToDelete   = null;
    this.showDeleteConfirm = false;
    this.applyFilters();
  }
 
  // ── Export & Download ─────────────────────────────────────────────────
 
  exportCourses(): void {
    const headers = ['Código', 'Curso', 'Área', 'Nivel', 'Docente', 'Alumnos', 'Promedio', 'Estado'];
    const rows    = this.filteredCourses.map(c => [
      c.code, c.name, c.area, c.level, c.teacher, c.students, c.avgGrade, c.status,
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'cursos_educore.csv';
    a.click();
    URL.revokeObjectURL(url);
  }
 
  downloadSyllabus(): void {
    if (this.selectedCourse) {
      console.log('Downloading syllabus for:', this.selectedCourse?.name);
      // Connect to your document service
    }
  }
 
  // ── Pagination ────────────────────────────────────────────────────────
 
  prevPage(): void {
    if (this.currentPage > 1) { this.currentPage--; this.cdr.markForCheck(); }
  }
 
  nextPage(): void {
    if (this.currentPage < this.totalPages) { this.currentPage++; this.cdr.markForCheck(); }
  }
 
  goToPage(page: number): void {
    this.currentPage = page;
    this.cdr.markForCheck();
  }
 
  // ── Validation ────────────────────────────────────────────────────────
 
  isFormValid(): boolean {
    return !!(
      this.courseForm.code?.trim() &&
      this.courseForm.name?.trim() &&
      this.courseForm.area &&
      this.courseForm.level &&
      this.courseForm.teacher
    );
  }
 
  resetForm(): void {
    this.courseForm = this.blankForm();
    this.resetWeekDays();
    this.cdr.markForCheck();
  }
 
  // ── Helpers ───────────────────────────────────────────────────────────
 
  private blankForm(): CourseForm {
    return {
      code: '', name: '', area: '', level: '', grade: '',
      teacher: '', hoursPerWeek: null, maxStudents: null,
      units: null, status: 'Activo', description: '',
    };
  }
 
  private fillForm(course: Course): void {
    this.courseForm = {
      code:         course.code,
      name:         course.name,
      area:         course.area,
      level:        course.level,
      grade:        course.grade,
      teacher:      course.teacher,
      hoursPerWeek: course.hoursPerWeek,
      maxStudents:  null,
      units:        course.units,
      status:       course.status,
      description:  course.description,
    };
  }
 
  private resetWeekDays(): void {
    this.weekDays = this.weekDays.map(d => ({ ...d, selected: false }));
  }
 
  private buildSchedule(): string[] {
    return this.weekDays
      .filter(d => d.selected)
      .map(d => `${d.label} ${d.start}–${d.end}`);
  }
 
  private getInitials(fullName: string): string {
    return fullName
      .replace('Prof. ', '')
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('');
  }
}