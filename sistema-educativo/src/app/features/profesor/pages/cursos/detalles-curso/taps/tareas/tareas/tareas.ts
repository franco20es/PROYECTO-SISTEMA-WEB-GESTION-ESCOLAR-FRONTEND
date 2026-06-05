// tareas-docente.ts
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TareaDocenteService } from '../../../../../../services/tareas.service'; 
import { ToastService } from '../../../../../../../../core/services/toast/toast.service'; 
import { environment } from '../../../../../../../../../environment/environment';

@Component({
  selector: 'app-tareas-docente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tareas.html',
  styleUrl: './tareas.css',
})
export class TareasDocente implements OnInit {

  @Input() cursoId!: string;

  private tareaService = inject(TareaDocenteService);
  private toast        = inject(ToastService);
  private api          = environment.apiUrl;

  cargando = signal(true);
  tareas   = signal<any[]>([]);

  // Modal crear
  modalCrear = signal(false);
  form = { nombre: '', descripcion: '', fechaLimite: '', presencial: false };
  guardando = signal(false);

  // Modal entregas
  modalEntregas = signal(false);
  tareaActiva: any = null;
  entregas = signal<any[]>([]);
  cargandoEntregas = signal(false);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.tareaService.listar(this.cursoId).subscribe({
      next: (data) => { this.tareas.set(data || []); this.cargando.set(false); },
      error: () => { this.tareas.set([]); this.cargando.set(false); }
    });
  }

  // ── Crear ──
  abrirModalCrear(): void {
    this.form = { nombre: '', descripcion: '', fechaLimite: '', presencial: false };
    this.modalCrear.set(true);
  }

  crear(): void {
    if (!this.form.nombre.trim() || !this.form.fechaLimite) {
      this.toast.show('Completa el nombre y la fecha límite', 'warn');
      return;
    }
    this.guardando.set(true);
    this.tareaService.crear(this.cursoId, {
      nombre: this.form.nombre.trim(),
      descripcion: this.form.descripcion.trim(),
      fechaLimite: this.form.fechaLimite,
      presencial: this.form.presencial
    }).subscribe({
      next: () => {
        this.cargar();
        this.guardando.set(false);
        this.modalCrear.set(false);
        this.toast.show('Tarea creada', 'ok');
      },
      error: (err) => {
        this.guardando.set(false);
        this.toast.show(err.error?.message || 'Error al crear', 'error');
      }
    });
  }

  eliminar(tarea: any, event: Event): void {
    event.stopPropagation();
    if (!confirm(`¿Eliminar la tarea "${tarea.nombre}"?`)) return;
    this.tareaService.eliminar(tarea.id).subscribe({
      next: () => {
        this.tareas.set(this.tareas().filter(t => t.id !== tarea.id));
        this.toast.show('Tarea eliminada', 'info');
      },
      error: () => { this.toast.show('Error al eliminar', 'error'); }
    });
  }

  // ── Entregas ──
  verEntregas(tarea: any): void {
    this.tareaActiva = tarea;
    this.modalEntregas.set(true);
    this.cargandoEntregas.set(true);
    this.entregas.set([]);
    this.tareaService.entregas(tarea.id).subscribe({
      next: (data) => { this.entregas.set(data || []); this.cargandoEntregas.set(false); },
      error: () => { this.entregas.set([]); this.cargandoEntregas.set(false); }
    });
  }

  descargarEntrega(entrega: any): void {
    // Abre el endpoint de descarga (con token via interceptor, o nueva pestaña)
    const url = `${this.api}/tareas/entregas/${entrega.id}/descargar`;
    window.open(url, '_blank');
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  estadoColor(estado: string): string {
    const map: Record<string, string> = {
      ENTREGADO: '#1D9E75', CALIFICADO: '#2A63E6', PENDIENTE: '#BA7517', VENCIDO: '#E53030'
    };
    return map[estado] || '#64748B';
  }
}