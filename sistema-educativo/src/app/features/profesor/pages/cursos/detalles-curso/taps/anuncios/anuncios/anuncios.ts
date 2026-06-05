// anuncios-docente.ts
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AnuncioDocenteService } from '../../../../../../services/anuncio.service'; 
import { ToastService } from '../../../../../../../../core/services/toast/toast.service'; 
 
@Component({
  selector: 'app-anuncios-docente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './anuncios.html',
  styleUrl: './anuncios.css',
})
export class AnunciosDocente implements OnInit {
 
  @Input() cursoId!: string;
 
  private anuncioService = inject(AnuncioDocenteService);
  private toast          = inject(ToastService);
 
  cargando = signal(true);
  anuncios = signal<any[]>([]);
 
  // Modal crear
  modalAbierto = signal(false);
  guardando = signal(false);
  form = { titulo: '', cuerpo: '', fijado: false };
 
  ngOnInit(): void {
    this.cargar();
  }
 
  cargar(): void {
    this.cargando.set(true);
    this.anuncioService.listar(this.cursoId).subscribe({
      next: (data) => { this.anuncios.set(data || []); this.cargando.set(false); },
      error: () => { this.anuncios.set([]); this.cargando.set(false); }
    });
  }
 
  abrirModal(): void {
    this.form = { titulo: '', cuerpo: '', fijado: false };
    this.modalAbierto.set(true);
  }
 
  cerrarModal(): void {
    this.modalAbierto.set(false);
  }
 
  publicar(): void {
    if (!this.form.titulo.trim() || !this.form.cuerpo.trim()) {
      this.toast.show('Completa título y contenido', 'warn');
      return;
    }
    this.guardando.set(true);
    this.anuncioService.crear(this.cursoId, {
      titulo: this.form.titulo.trim(),
      cuerpo: this.form.cuerpo.trim(),
      fijado: this.form.fijado
    }).subscribe({
      next: (nuevo) => {
        // Recargar para respetar orden (fijados primero)
        this.cargar();
        this.guardando.set(false);
        this.modalAbierto.set(false);
        this.toast.show('Anuncio publicado', 'ok');
      },
      error: (err) => {
        this.guardando.set(false);
        this.toast.show(err.error?.message || 'Error al publicar', 'error');
      }
    });
  }
 
  eliminar(anuncio: any, event: Event): void {
    event.stopPropagation();
    if (!confirm(`¿Eliminar el anuncio "${anuncio.titulo}"?`)) return;
    this.anuncioService.eliminar(anuncio.id).subscribe({
      next: () => {
        this.anuncios.set(this.anuncios().filter(a => a.id !== anuncio.id));
        this.toast.show('Anuncio eliminado', 'info');
      },
      error: () => { this.toast.show('Error al eliminar', 'error'); }
    });
  }
 
  formatearFecha(fecha: string): string {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-PE', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  }
}