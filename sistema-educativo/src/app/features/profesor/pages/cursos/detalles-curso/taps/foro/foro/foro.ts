// foro-docente.ts
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ForoDocenteService } from '../../../../../../services/foro.service'; 
import { ToastService } from '../../../../../../../../core/services/toast/toast.service'; 

@Component({
  selector: 'app-foro-docente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './foro.html',
  styleUrl: './foro.css',
})
export class ForoDocente implements OnInit {

  @Input() cursoId!: string;

  private foroService = inject(ForoDocenteService);
  private toast       = inject(ToastService);

  cargando = signal(true);
  foros    = signal<any[]>([]);

  // Modal crear foro
  modalCrear = signal(false);
  form = { titulo: '', descripcion: '' };
  guardando = signal(false);

  // Vista de foro abierto (mensajes)
  foroAbierto = signal<any | null>(null);
  cargandoMensajes = signal(false);
  nuevoMensaje = '';
  enviando = signal(false);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.foroService.listar(this.cursoId).subscribe({
      next: (data) => { this.foros.set(data || []); this.cargando.set(false); },
      error: () => { this.foros.set([]); this.cargando.set(false); }
    });
  }

  // ── Crear foro ──
  abrirModalCrear(): void {
    this.form = { titulo: '', descripcion: '' };
    this.modalCrear.set(true);
  }

  crear(): void {
    if (!this.form.titulo.trim()) {
      this.toast.show('Escribe el título del foro', 'warn');
      return;
    }
    this.guardando.set(true);
    this.foroService.crear(this.cursoId, {
      titulo: this.form.titulo.trim(),
      descripcion: this.form.descripcion.trim()
    }).subscribe({
      next: () => {
        this.cargar();
        this.guardando.set(false);
        this.modalCrear.set(false);
        this.toast.show('Foro creado', 'ok');
      },
      error: (err) => {
        this.guardando.set(false);
        this.toast.show(err.error?.message || 'Error al crear', 'error');
      }
    });
  }

  eliminar(foro: any, event: Event): void {
    event.stopPropagation();
    if (!confirm(`¿Eliminar el foro "${foro.titulo}" y todos sus mensajes?`)) return;
    this.foroService.eliminar(foro.id).subscribe({
      next: () => {
        this.foros.set(this.foros().filter(f => f.id !== foro.id));
        this.toast.show('Foro eliminado', 'info');
      },
      error: () => { this.toast.show('Error al eliminar', 'error'); }
    });
  }

  // ── Abrir foro y mensajes ──
  abrirForo(foro: any): void {
    this.cargandoMensajes.set(true);
    this.foroAbierto.set(foro);  // muestra mientras carga
    this.foroService.abrir(foro.id).subscribe({
      next: (data) => { this.foroAbierto.set(data); this.cargandoMensajes.set(false); },
      error: () => { this.cargandoMensajes.set(false); }
    });
  }

  volverALista(): void {
    this.foroAbierto.set(null);
    this.nuevoMensaje = '';
  }

  enviarMensaje(): void {
    if (!this.nuevoMensaje.trim()) return;
    const foro = this.foroAbierto();
    if (!foro) return;
    this.enviando.set(true);
    this.foroService.publicarMensaje(foro.id, { contenido: this.nuevoMensaje.trim() }).subscribe({
      next: () => {
        this.nuevoMensaje = '';
        this.enviando.set(false);
        // Recargar el foro para ver el mensaje nuevo
        this.abrirForo(foro);
      },
      error: (err) => {
        this.enviando.set(false);
        this.toast.show(err.error?.message || 'Error al enviar', 'error');
      }
    });
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-PE', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
    });
  }
}