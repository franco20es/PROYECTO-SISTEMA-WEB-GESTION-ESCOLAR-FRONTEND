import { Component, ChangeDetectionStrategy, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Evaluation {
  name: string;
  type: string;
  typeLbl: string;
  typeCls: string;
  date: string;
  pts: number;
  locked: boolean;
  graded: number;
}

interface StudentGrade {
  nota: number | null;
  locked: boolean;
  obs: string;
}

@Component({
  selector: 'app-calificaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calificaciones.html',
  styleUrl: './calificaciones.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Calificaciones {
  // Datos estáticos internos
  readonly STUDENTS = ['Aguirre López, Pedro', 'Álvarez Quispe, María', 'Benites Ruiz, Ana', 'Campos Torres, Luis', 'Castillo Vega, Rosa', 'Chávez Díaz, Jorge', 'Cruz Mendoza, Lucía', 'Delgado Ramos, Carlos', 'Espinoza Paredes, Sofía', 'Fernández León, Diego', 'García Huamán, Andrea', 'Gómez Salazar, Kevin', 'Gutiérrez Flores, Valeria', 'Herrera Sánchez, Marco', 'Huamán Rivera, Carmen', 'López Castro, Daniel', 'Martínez Arias, Isabella', 'Mendoza Vargas, Sebastián', 'Morales Chávez, Jimena', 'Ortega Cruz, Alejandro', 'Paredes Gutiérrez, Camila', 'Pérez Herrera, Fernando', 'Quispe Espinoza, Natalia', 'Ramírez García, Gabriel', 'Rivera López, Antonella', 'Rojas Benites, Miguel', 'Salazar Campos, Daniela', 'Sánchez Castillo, Rodrigo', 'Torres Álvarez, Mariana', 'Vargas Delgado, Adrián', 'Vega Martínez, Paola', 'Villanueva Ortega, Emilio'];
  readonly COLORS = ['#2A63E6', '#FF5B1F', '#00C27C', '#9B59B6', '#F5A623', '#E53030', '#1340A0', '#d08a00'];
  
  readonly EVALS: Evaluation[] = [
    { name: 'Examen Parcial — Bimestre II', type: 'exam', typeLbl: 'Examen', typeCls: 'eb-exam', date: '08 May 2025', pts: 20, locked: true, graded: 28 },
    { name: 'Práctica Calificada #4', type: 'prac', typeLbl: 'Práctica', typeCls: 'eb-prac', date: '05 May 2025', pts: 20, locked: true, graded: 32 },
    { name: 'Tarea #5 — Funciones', type: 'tarea', typeLbl: 'Tarea', typeCls: 'eb-tarea', date: '01 May 2025', pts: 20, locked: false, graded: 0 },
    { name: 'Tarea #6 — Función cuadrática', type: 'tarea', typeLbl: 'Tarea', typeCls: 'eb-tarea', date: '15 May 2025', pts: 20, locked: false, graded: 0 },
    { name: 'Foro: Aplicaciones de ecuaciones', type: 'foro', typeLbl: 'Foro', typeCls: 'eb-foro', date: '10 May 2025', pts: 20, locked: false, graded: 0 },
    { name: 'Actividad grupal — Geogebra', type: 'activ', typeLbl: 'Actividad', typeCls: 'eb-activ', date: '12 May 2025', pts: 20, locked: false, graded: 0 }
  ];

  // Señales de Estado
  selectedCurso = signal<string>('mat');
  selectedSeccion = signal<string>('3A');
  selectedEvalIndex = signal<string>('');
  searchQuery = signal<string>('');
  sortMode = signal<string>('list');
  hasUnsaved = signal<boolean>(false);

  // Notas de estudiantes mapeadas por índice
  grades = signal<{ [key: number]: StudentGrade }>({});

  // Control de Modales y Toasts
  isModalOpen = signal<boolean>(false);
  modTargetIndex = signal<number | null>(null);
  modNewNota = signal<string>('');
  modPrio = signal<string>('Normal');
  modMotivo = signal<string>('');

  toast = signal<{ show: boolean; msg: string; type: 'ok' | 'info' | 'warn' | 'er' }>({
    show: false, msg: '', type: 'ok'
  });
  private toastTimeout: any;

  // Computeds
  activeEval = computed<Evaluation | null>(() => {
    const index = this.selectedEvalIndex();
    return index !== '' ? this.EVALS[+index] : null;
  });

  // Lista procesada, filtrada y ordenada de estudiantes
  processedStudents = computed(() => {
    const search = this.searchQuery().toLowerCase();
    const mode = this.sortMode();
    const currentGrades = this.grades();
    const evaluation = this.activeEval();

    // Mapear a una estructura con metadatos para renderizado rápido
    let list = this.STUDENTS.map((name, index) => {
      const code = `COD-2025-${3000 + index}`;
      const gradeInfo = currentGrades[index] || { nota: null, locked: false, obs: '' };
      return {
        index,
        name,
        code,
        gradeInfo,
        initials: this.getInitials(name),
        avatarColor: this.COLORS[index % this.COLORS.length],
        promAcum: this.getRandomInt(11, 18) // Simulación del HTML original
      };
    });

    // Aplicar Filtro de Búsqueda
    if (search) {
      list = list.filter(item => 
        item.name.toLowerCase().includes(search) || item.code.includes(search)
      );
    }

    // Aplicar Criterio de Ordenamiento
    if (mode === 'az') list.sort((a, b) => a.name.localeCompare(b.name));
    else if (mode === 'za') list.sort((a, b) => b.name.localeCompare(a.name));
    else if (mode === 'pend') {
      list.sort((a, b) => (a.gradeInfo.nota === null ? 0 : 1) - (b.gradeInfo.nota === null ? 0 : 1));
    } else if (mode === 'low') {
      list.sort((a, b) => {
        const na = a.gradeInfo.nota ?? 999;
        const nb = b.gradeInfo.nota ?? 999;
        return na - nb;
      });
    }

    return list;
  });

  // Métricas Calculadas Reactivamente
  stats = computed(() => {
    const currentGrades = this.grades();
    const total = this.STUDENTS.length;
    let calif = 0, pend = 0, apr = 0, des = 0, sum = 0;

    this.STUDENTS.forEach((_, i) => {
      const g = currentGrades[i];
      if (g && g.nota !== null) {
        calif++;
        sum += g.nota;
        if (g.nota >= 11) apr++; else des++;
      } else {
        pend++;
      }
    });

    const avg = calif > 0 ? (sum / calif).toFixed(1) : '—';
    const pct = total > 0 ? Math.round((calif / total) * 100) : 0;
    const dash = (94.2 * pct) / 100;

    return { total, calif, pend, apr, des, avg, pct, strokeDash: `${dash} ${94.2 - dash}` };
  });

  constructor() {
    // Escucha cambios en la evaluación activa para reconstruir el set de datos inicial
    effect(() => {
      const evaluation = this.activeEval();
      if (!evaluation) {
        this.grades.set({});
        this.hasUnsaved.set(false);
        return;
      }

      const initialGrades: { [key: number]: StudentGrade } = {};
      this.STUDENTS.forEach((_, i) => {
        if (i < evaluation.graded) {
          initialGrades[i] = {
            nota: this.getRandomInt(6, evaluation.pts),
            locked: evaluation.locked,
            obs: ''
          };
        } else {
          initialGrades[i] = { nota: null, locked: false, obs: '' };
        }
      });

      this.grades.set(initialGrades);
      this.hasUnsaved.set(false);
    }, { allowSignalWrites: true });
  }

  // Eventos de Formulario y Mutaciones de Estado
  onEvalChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedEvalIndex.set(target.value);
    this.searchQuery.set('');
    this.sortMode.set('list');
  }

  onResetEval() {
    this.selectedEvalIndex.set('');
  }

  onNotaInput(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    let rawValue = input.value.replace(/[^0-9]/g, '');
    if (rawValue.length > 2) rawValue = rawValue.slice(0, 2);
    
    let numericValue = parseInt(rawValue, 10);
    const maxPts = this.activeEval()?.pts ?? 20;

    if (!isNaN(numericValue) && numericValue > maxPts) {
      numericValue = maxPts;
    }

    this.grades.update(current => {
      const updated = { ...current };
      updated[index] = {
        ...updated[index],
        nota: isNaN(numericValue) ? null : numericValue
      };
      return updated;
    });

    this.hasUnsaved.set(true);
  }

  onObsInput(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    this.grades.update(current => {
      const updated = { ...current };
      updated[index] = { ...updated[index], obs: input.value };
      return updated;
    });
    this.hasUnsaved.set(true);
  }

  massGrade(nota: number) {
    let count = 0;
    const currentGrades = { ...this.grades() };

    this.STUDENTS.forEach((_, i) => {
      if (!currentGrades[i] || (currentGrades[i].nota === null && !currentGrades[i].locked)) {
        currentGrades[i] = { ...(currentGrades[i] || {}), nota, locked: false, obs: currentGrades[i]?.obs ?? '' };
        count++;
      }
    });

    if (count === 0) {
      this.showToast('No hay notas pendientes', 'info');
      return;
    }

    this.grades.set(currentGrades);
    this.hasUnsaved.set(true);
    this.showToast(`${count} estudiantes calificados con ${nota}`, 'ok');
  }

  clearPending() {
    let count = 0;
    const currentGrades = { ...this.grades() };

    this.STUDENTS.forEach((_, i) => {
      if (currentGrades[i] && !currentGrades[i].locked && currentGrades[i].nota !== null) {
        currentGrades[i].nota = null;
        count++;
      }
    });

    if (count === 0) {
      this.showToast('No hay pendientes que limpiar', 'info');
      return;
    }

    this.grades.set(currentGrades);
    this.hasUnsaved.set(true);
    this.showToast(`${count} notas limpiadas`, 'info');
  }

  saveDraft() {
    this.hasUnsaved.set(false);
    this.showToast('Borrador guardado correctamente', 'info');
  }

  saveNotas() {
    const currentGrades = { ...this.grades() };
    let pendCount = 0;

    this.STUDENTS.forEach((_, i) => {
      if (!currentGrades[i] || currentGrades[i].nota === null) pendCount++;
    });

    if (pendCount > 0) {
      this.showToast(`Aún tienes ${pendCount} estudiantes sin calificar`, 'warn');
      return;
    }

    // Bloquear todas las celdas asignadas
    this.STUDENTS.forEach((_, i) => {
      if (currentGrades[i]) currentGrades[i].locked = true;
    });

    const evalIndex = +this.selectedEvalIndex();
    this.EVALS[evalIndex].locked = true;

    this.grades.set(currentGrades);
    this.hasUnsaved.set(false);
    this.showToast('✓ Notas guardadas y publicadas correctamente', 'ok');
  }

  // Control del cuadro de diálogo para modificaciones bajo llave
  openModRequest(index: number) {
    this.modTargetIndex.set(index);
    this.modNewNota.set('');
    this.modMotivo.set('');
    this.modPrio.set('Normal');
    this.isModalOpen.set(true);
  }

  closeMo() {
    this.isModalOpen.set(false);
    this.modTargetIndex.set(null);
  }

  sendModRequest() {
    const note = this.modNewNota();
    const reason = this.modMotivo().trim();
    const target = this.modTargetIndex();

    if (!note) { this.showToast('Ingresa la nueva nota solicitada', 'warn'); return; }
    if (!reason) { this.showToast('Ingresa el motivo de la modificación', 'warn'); return; }

    this.closeMo();
    if (target !== null) {
      this.showToast(`Solicitud enviada al administrador para ${this.STUDENTS[target].split(',')[0]}`, 'ok');
    }
  }

  // Helpers de Estilo y Visualización
  getNotaCls(nota: number | null): string {
    if (nota === null) return '';
    return nota >= 15 ? 'hi' : nota >= 11 ? 'mi' : 'lo';
  }

  getNotaColor(nota: number | null): string {
    if (nota === null) return 'var(--g4)';
    return nota >= 15 ? 'var(--ok)' : nota >= 11 ? 'var(--wa)' : 'var(--er)';
  }

  private getInitials(name: string): string {
    return name.split(',')[0].split(' ').map(w => w[0]).join('').slice(0, 2);
  }

  private getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  showToast(msg: string, type: 'ok' | 'info' | 'warn' | 'er' = 'ok') {
    clearTimeout(this.toastTimeout);
    this.toast.set({ show: true, msg, type });
    this.toastTimeout = setTimeout(() => {
      this.toast.update(t => ({ ...t, show: false }));
    }, 3200);
  }
}