import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Estudiante {
  name: string; prom: number; asist: number; tareas: string; status: string;
  dni: string; code: string; color: string; notas: number[]; asistData: string[];
  tel: string; email: string; apoderado: string; apTel: string; direccion: string;
}

@Component({
  selector: 'app-estudiantes',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './estudiantes.html',
  styleUrl: './estudiantes.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Estudiantes {
  // Estado inicial con un único alumno hardcodeado
  public estudiantes = signal<Estudiante[]>([
    {
      name: 'Aguirre López, Pedro',
      prom: 16,
      asist: 85,
      tareas: '6/7',
      status: 'ok',
      dni: '73481029',
      code: 'COD-2025-3000',
      color: '#2A63E6',
      notas: [15, 14, 18, 12, 16, 17, 15],
      asistData: ['P','P','T','P','F','P','P','P','J','P','P','P','P','T','P','P','P','P','P','P'],
      tel: '984721039',
      email: 'aguirrelopez@email.com',
      apoderado: 'María López',
      apTel: '910293847',
      direccion: 'Av. Los Maestros 415, Ica'
    }
  ]);

  // Signals de control de filtros de interfaz
  public cursoSeleccionado = signal<string>('mat3a');
  public searchFilter = signal<string>('');
  public currentChip = signal<string>('all');
  public currentSort = signal<string>('list');
  public currentView = signal<'table' | 'grid'>('table');
  
  // Drawer y Toast state
  public activeEstudianteIndex = signal<number | null>(null);
  public activeTab = signal<number>(0);
  public toast = signal<{ show: boolean; msg: string; type: 'ok' | 'info' | 'warn' }>({ show: false, msg: '', type: 'ok' });
  private toastTimeout: any;

  // Evaluación de Notas estáticas para la cabecera de la tabla de notas
  public evaluaciones = ['E.Parcial', 'P.C#4', 'T#5', 'T#4', 'T#3', 'P.C#3', 'T#2'];

  // ─── COMPUTED SIGNALS (Reemplaza a getFiltered() y renderAll()) ───
  public filteredEstudiantes = computed(() => {
    let list = this.estudiantes().map((d, i) => ({ ...d, idx: i }));
    const query = this.searchFilter().toLowerCase().trim();

    if (query) {
      list = list.filter(d => d.name.toLowerCase().includes(query) || d.code.includes(query));
    }
    if (this.currentChip() === 'risk') list = list.filter(d => d.status === 'risk');
    if (this.currentChip() === 'exc') list = list.filter(d => d.status === 'exc');

    const sort = this.currentSort();
    if (sort === 'az') list.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'prom-desc') list.sort((a, b) => b.prom - a.prom);
    if (sort === 'prom-asc') list.sort((a, b) => a.prom - b.prom);
    if (sort === 'asist-asc') list.sort((a, b) => a.asist - b.asist);

    return list;
  });

  public kpis = computed(() => {
    const rawData = this.estudiantes();
    if (rawData.length === 0) return { total: 0, avgProm: '0.0', avgAsist: 0, exc: 0, risk: 0 };
    
    const exc = rawData.filter(d => d.status === 'exc').length;
    const risk = rawData.filter(d => d.status === 'risk').length;
    const avgProm = (rawData.reduce((a, d) => a + d.prom, 0) / rawData.length).toFixed(1);
    const avgAsist = Math.round(rawData.reduce((a, d) => a + d.asist, 0) / rawData.length);
    
    return { total: rawData.length, avgProm, avgAsist, exc, risk };
  });

  public seleccionado = computed(() => {
    const idx = this.activeEstudianteIndex();
    return idx !== null ? this.estudiantes()[idx] : null;
  });

  // Contadores de asistencia dinámicos para el panel del Drawer
  public asistenciaCounts = computed(() => {
    const s = this.seleccionado();
    const counts = { P: 0, T: 0, F: 0, J: 0 };
    if (s) s.asistData.forEach(type => { if (type in counts) counts[type as keyof typeof counts]++; });
    return counts;
  });

  // ─── ACCIONES DE MENTORÍA / CONTROL ───
  public openDrawer(idx: number): void {
    this.activeEstudianteIndex.set(idx);
    this.activeTab.set(0);
  }

  public closeDrawer(): void {
    this.activeEstudianteIndex.set(null);
  }

  public showToast(msg: string, type: 'ok' | 'info' | 'warn' = 'ok'): void {
    clearTimeout(this.toastTimeout);
    this.toast.set({ show: true, msg, type });
    this.toastTimeout = setTimeout(() => this.toast.update(t => ({ ...t, show: false })), 3200);
  }

  // Helpers de color para los estilos dinámicos
  public nColor(v: number): string { return v >= 15 ? 'var(--ok)' : v >= 11 ? 'var(--wa)' : 'var(--er)'; }
  public pColor(v: number): string { return v >= 90 ? 'var(--ok)' : v >= 75 ? 'var(--wa)' : 'var(--er)'; }
  public getInitials(name: string): string { return name.split(',')[0].split(' ').map(w => w[0]).join('').slice(0, 2); }
}