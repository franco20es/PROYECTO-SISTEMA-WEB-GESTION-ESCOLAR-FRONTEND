// foro.ts
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../../../../../../core/services/toast/toast.service';
import { ForoService } from '../../../../../../service/foro.service';

@Component({
  selector: 'app-foro-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './foro.html',
  styleUrl: './foro.css',
})
export class ForoTab implements OnInit {

  @Input() cursoId!: string;

  private foroService = inject(ForoService);
  private toast       = inject(ToastService);

  // Vista: 'lista' (todos los foros) | 'detalle' (un foro abierto)
  vista: 'lista' | 'detalle' = 'lista';

  cargando = true;
  foros: any[] = [];

  // Foro abierto
  foroActivo: any = null;
  cargandoDetalle = false;

  // Nuevo mensaje
  nuevoMensaje = '';
  enviando = false;

  ngOnInit(): void {
    this.cargarForos();
  }

  cargarForos(): void {
    this.cargando = true;
    this.foroService.listarForos(this.cursoId).subscribe({
      next: (data) => {
        this.foros = data || [];
        this.cargando = false;
      },
      error: () => {
        this.foros = [];
        this.cargando = false;
      }
    });
  }

  abrirForo(foro: any): void {
    this.vista = 'detalle';
    this.cargandoDetalle = true;
    this.foroActivo = null;
    this.foroService.abrirForo(foro.id).subscribe({
      next: (data) => {
        this.foroActivo = data;
        this.cargandoDetalle = false;
      },
      error: () => {
        this.cargandoDetalle = false;
        this.toast.show('No se pudo abrir el foro', 'error');
        this.volverALista();
      }
    });
  }

  volverALista(): void {
    this.vista = 'lista';
    this.foroActivo = null;
    this.nuevoMensaje = '';
    this.cargarForos(); // refresca contadores
  }

  enviarMensaje(): void {
    if (!this.nuevoMensaje.trim() || !this.foroActivo) return;
    this.enviando = true;

    this.foroService.publicarMensaje(this.foroActivo.id, this.nuevoMensaje).subscribe({
      next: (msg) => {
        // Agrega el mensaje al hilo
        if (!this.foroActivo.mensajes) this.foroActivo.mensajes = [];
        this.foroActivo.mensajes.push(msg);
        this.foroActivo.totalMensajes = this.foroActivo.mensajes.length;
        this.nuevoMensaje = '';
        this.enviando = false;
      },
      error: (err) => {
        this.enviando = false;
        this.toast.show(err.error?.message || 'Error al publicar', 'error');
      }
    });
  }

  iniciales(nombre: string): string {
    if (!nombre) return '?';
    const p = nombre.trim().split(' ');
    return p.length >= 2
      ? (p[0][0] + p[1][0]).toUpperCase()
      : nombre.substring(0, 2).toUpperCase();
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-PE', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
    });
  }
}