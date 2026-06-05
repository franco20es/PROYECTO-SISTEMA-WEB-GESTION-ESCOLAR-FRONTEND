import { ChangeDetectionStrategy, Component, computed, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Justificacion {
  id: number;
  student: string;
  aula: string;
  detail: string;
  motivo: string;
  status: 'pend' | 'ok' | 'rej';
  date: string;
}

@Component({
  selector: 'app-asistencia',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './asistencia.html',
  styleUrl: './asistencia.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Asistencia {
  // --- DATA INMUTABLE ---
  readonly STUDENTS = [
    'Aguirre López, Pedro', 'Álvarez Quispe, María', 'Benites Ruiz, Ana', 'Campos Torres, Luis',
    'Castillo Vega, Rosa', 'Chávez Díaz, Jorge', 'Cruz Mendoza, Lucía', 'Delgado Ramos, Carlos',
    'Espinoza Paredes, Sofía', 'Fernández León, Diego', 'García Huamán, Andrea', 'Gómez Salazar, Kevin',
    'Gutiérrez Flores, Valeria', 'Herrera Sánchez, Marco', 'Huamán Rivera, Carmen', 'López Castro, Daniel',
    'Martínez Arias, Isabella', 'Mendoza Vargas, Sebastián', 'Morales Chávez, Jimena', 'Ortega Cruz, Alejandro',
    'Paredes Gutiérrez, Camila', 'Pérez Herrera, Fernando', 'Quispe Espinoza, Natalia', 'Ramírez García, Gabriel',
    'Rivera López, Antonella', 'Rojas Benites, Miguel', 'Salazar Campos, Daniela', 'Sánchez Castillo, Rodrigo',
    'Torres Álvarez, Mariana', 'Vargas Delgado, Adrián', 'Vega Martínez, Paola', 'Villanueva Ortega, Emilio'
  ];

  readonly COLORS = ['#2A63E6', '#FF5B1F', '#00C27C', '#9B59B6', '#F5A623', '#E53030', '#1340A0', '#d08a00'];
  readonly DATES = ['5/5', '6/5', '7/5', '8/5', '9/5'];

  readonly CURSOS = [
    { value: 0, name: 'Matemáticas — 3ro A', alumnos: 32 },
    { value: 1, name: 'Matemáticas — 3ro B', alumnos: 30 },
    { value: 2, name: 'Física — 4to A', alumnos: 28 },
    { value: 3, name: 'Física — 4to B', alumnos: 31 }
  ];

  // --- SIGNALS DE ESTADO ---
  currentCursoIdx = signal<number>(0);
  activeTab = signal<number>(0);
  searchQuery = signal<string>('');
  
  // Asistencia de hoy: clave es el índice del alumno, valor es el tipo de marca
  attendance = signal<{ [key: number]: 'P' | 'T' | 'F' | 'J' }>({});
  
  // Histórico precargado simulado
  histData = signal<{ [key: number]: string[] }>({});

  // Toast Control
  toastState = signal<{ show: boolean; msg: string; type: string }>({ show: false, msg: 'OK', type: 'ok' });
  private toastTimeout: any;

  // Justificaciones dinámicas
  justificaciones = signal<Justificacion[]>([
    { id: 1, student: 'Ramírez García, Gabriel', aula: '3ro A', detail: 'Falta del 9 de mayo · Certificado médico adjunto', motivo: 'Cita médica programada en EsSalud', status: 'pend', date: '10 May' },
    { id: 2, student: 'Castillo Vega, Rosa', aula: '3ro A', detail: 'Falta del 7 de mayo · Documento de viaje adjunto', motivo: 'Viaje familiar por emergencia', status: 'pend', date: '8 May' },
    { id: 3, student: 'López Castro, Daniel', aula: '3ro A', detail: 'Faltas del 5 y 6 de mayo · Sin documento adjunto', motivo: 'Enfermedad (apoderado notificó por teléfono)', status: 'pend', date: '7 May' }
  ]);

  historialResuelto = signal<{ student: string; detail: string; status: 'ok' | 'rej'; date: string }[]>([
    { student: 'Álvarez Quispe, María — 3ro A', detail: 'Falta del 25 abril · Certificado médico', status: 'ok', date: '28 Abr' },
    { student: 'Gómez Salazar, Kevin — 3ro A', detail: 'Falta del 22 abril · Sin documento adjunto', status: 'rej', date: '24 Abr' }
  ]);

  constructor() {
    this.generateMockHistory();
    
    // Limpia la asistencia si se cambia el curso seleccionado
    effect(() => {
      this.currentCursoIdx();
      this.attendance.set({});
    }, { allowSignalWrites: true });
  }

  // --- GETTERS COMPUTADOS ---
  currentCurso = computed(() => this.CURSOS[this.currentCursoIdx()]);

  counts = computed(() => {
    const vals = Object.values(this.attendance());
    const p = vals.filter(v => v === 'P').length;
    const t = vals.filter(v => v === 'T').length;
    const f = vals.filter(v => v === 'F').length;
    const j = vals.filter(v => v === 'J').length;
    const none = this.STUDENTS.length - p - t - f - j;
    return { p, t, f, j, none };
  });

  filteredStudents = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.STUDENTS.map((name, i) => {
      const initials = name.split(',')[0].split(' ').map(w => w[0]).join('').slice(0, 2);
      const color = this.COLORS[i % this.COLORS.length];
      const mark = this.attendance()[i] || '';
      
      const hist = this.histData()[i] || [];
      const pCount = hist.filter(x => x === 'P').length;
      const pct = Math.round((pCount / hist.length) * 100) || 0;
      const pctColor = pct >= 90 ? 'var(--ok)' : pct >= 75 ? 'var(--wa)' : 'var(--er)';

      return { i, name, initials, color, mark, pct, pctColor, visible: !query || name.toLowerCase().includes(query) };
    }).filter(s => s.visible);
  });

  historialTable = computed(() => {
    return this.STUDENTS.map((name, i) => {
      const hist = this.histData()[i] || [];
      const todayMark = this.attendance()[i];
      const allMarks = [...hist];
      if (todayMark) allMarks.push(todayMark);
      
      const pCount = allMarks.filter(x => x === 'P').length;
      const pct = Math.round((pCount / allMarks.length) * 100) || 0;
      const pctColor = pct >= 90 ? 'var(--ok)' : pct >= 75 ? 'var(--wa)' : 'var(--er)';

      return { i, name, hist, todayMark, pct, pctColor };
    });
  });

  // --- MÉTODOS DE LOGÍSITCA ---
  generateMockHistory() {
    const data: { [key: number]: string[] } = {};
    this.STUDENTS.forEach((_, i) => {
      data[i] = this.DATES.map(() => {
        const r = Math.random();
        return r < .82 ? 'P' : r < .90 ? 'T' : r < .96 ? 'F' : 'J';
      });
    });
    this.histData.set(data);
  }

  switchTab(idx: number) {
    this.activeTab.set(idx);
  }

  changeCurso(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const val = +selectElement.value;
    this.currentCursoIdx.set(val);
    this.showToast(`Curso cambiado: ${this.CURSOS[val].name}`, 'info');
  }

  setMark(idx: number, mark: 'P' | 'T' | 'F' | 'J') {
    const current = { ...this.attendance() };
    if (current[idx] === mark) {
      delete current[idx];
    } else {
      current[idx] = mark;
    }
    this.attendance.set(current);
  }

  markAll(mark: 'P' | 'T' | 'F' | 'J') {
    const current: { [key: number]: 'P' | 'T' | 'F' | 'J' } = {};
    this.STUDENTS.forEach((_, i) => current[i] = mark);
    this.attendance.set(current);
    const namesMap = { P: 'Presente', T: 'Tardanza', F: 'Falta', J: 'Justificado' };
    this.showToast(`Todos marcados como ${namesMap[mark]}`);
  }

  clearAll() {
    this.attendance.set({});
    this.showToast('Asistencia limpiada', 'info');
  }

  saveAsistencia() {
    const total = Object.keys(this.attendance()).length;
    if (total < this.STUDENTS.length) {
      this.showToast(`Faltan ${this.STUDENTS.length - total} alumnos por marcar`, 'warn');
      return;
    }
    this.showToast('✓ Asistencia guardada correctamente');
  }

  resolverJustificacion(id: number, status: 'ok' | 'rej') {
    const target = this.justificaciones().find(j => j.id === id);
    if (!target) return;

    this.justificaciones.set(this.justificaciones().filter(j => j.id !== id));
    this.historialResuelto.set([
      ...this.historialResuelto(),
      { student: `${target.student} — ${target.aula}`, detail: target.detail.split(' · ')[0], status, date: 'Hoy' }
    ]);
    
    this.showToast(status === 'ok' ? 'Justificación aprobada' : 'Justificación rechazada', status === 'ok' ? 'ok' : 'er');
  }

  // --- MANEJO DEL TOAST COMPONENETAL ---
  showToast(msg: string, type: string = 'ok') {
    clearTimeout(this.toastTimeout);
    this.toastState.set({ show: true, msg, type });
    this.toastTimeout = setTimeout(() => {
      this.toastState.update(state => ({ ...state, show: false }));
    }, 3200);
  }
}