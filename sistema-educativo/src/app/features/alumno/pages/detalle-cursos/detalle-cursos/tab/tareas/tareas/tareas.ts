// tareas.ts
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../../../../../../core/services/toast/toast.service'; 
import { TareaService } from '../../../../../../service/tareas.service';

@Component({
  selector: 'app-tareas-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tareas.html',
  styleUrl: './tareas.css',
})
export class TareasTab implements OnInit {

  @Input() cursoId!: string;

  private tareaService = inject(TareaService);
  private toast        = inject(ToastService);

  cargando = true;
  tareas: any[] = [];

  // Modal entrega
  modalVisible = false;
  tareaSeleccionada: any = null;
  archivoEntrega: File | null = null;
  comentario = '';
  entregando = false;
  entregaExitosa = false;

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.tareaService.misTareas(this.cursoId).subscribe({
      next: (data) => {
        this.tareas = data;
        this.cargando = false;
      },
      error: () => {
        this.tareas = [];
        this.cargando = false;
      }
    });
  }

  get pendientes(): any[] {
    return this.tareas.filter(t => t.estado === 'PENDIENTE');
  }

  // ─── Modal ────────────────────────────────────────────────────────────────

  abrirModal(tarea: any): void {
    if (tarea.estado !== 'PENDIENTE') return;
    this.tareaSeleccionada = tarea;
    this.archivoEntrega    = null;
    this.comentario        = '';
    this.entregaExitosa    = false;
    this.entregando        = false;
    this.modalVisible      = true;
  }

  cerrarModal(): void {
    this.modalVisible = false;
    this.tareaSeleccionada = null;
  }

  onArchivo(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input.files?.[0]) {
      const f = input.files[0];
      if (f.size > 25 * 1024 * 1024) {
        this.toast.show('El archivo supera los 25MB', 'error');
        return;
      }
      this.archivoEntrega = f;
    }
  }

  quitarArchivo(): void { this.archivoEntrega = null; }

  enviar(): void {
    if (!this.archivoEntrega || !this.tareaSeleccionada) return;
    this.entregando = true;

    this.tareaService.entregar(this.tareaSeleccionada.id, this.archivoEntrega, this.comentario)
      .subscribe({
        next: (res) => {
          this.entregaExitosa = true;
          this.entregando = false;
          // Actualiza la tarea en la lista
          const idx = this.tareas.findIndex(t => t.id === this.tareaSeleccionada.id);
          if (idx >= 0) this.tareas[idx] = res;
          this.toast.show('¡Tarea entregada!', 'ok');
        },
        error: (err) => {
          this.entregando = false;
          this.toast.show(err.error?.message || 'Error al entregar', 'error');
        }
      });
  }

  get tamanioArchivo(): string {
    if (!this.archivoEntrega) return '';
    const mb = this.archivoEntrega.size / (1024 * 1024);
    return mb < 1
      ? `${(this.archivoEntrega.size / 1024).toFixed(0)} KB`
      : `${mb.toFixed(1)} MB`;
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  colorNota(n: number): string {
    if (n >= 15) return '#1D9E75';
    if (n >= 11) return '#BA7517';
    return '#A32D2D';
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '';
    return new Date(fecha + 'T00:00:00').toLocaleDateString('es-PE', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  }
}