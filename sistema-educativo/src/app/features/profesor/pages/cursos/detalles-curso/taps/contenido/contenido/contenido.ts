// contenido-docente.ts
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContenidoDocenteService } from '../../../../../../services/contenido.service';
import { ToastService } from '../../../../../../../../core/services/toast/toast.service';

@Component({
  selector: 'app-contenido-docente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contenido.html',
  styleUrl: './contenido.css',
})
export class ContenidoDocente implements OnInit {

  @Input() cursoId!: string;

  private contenidoService = inject(ContenidoDocenteService);
  private toast            = inject(ToastService);

  cargando = signal(true);
  semanas  = signal<any[]>([]);
  expandida = signal<string | null>(null);

  // Modal nueva semana
  modalSemana = signal(false);
  formSemana = { numero: 1, titulo: '' };
  guardandoSemana = signal(false);

  // Modal link
  modalLink = signal(false);
  semanaParaLink: any = null;
  formLink = { nombre: '', url: '' };
  guardandoLink = signal(false);

  // Subida de archivo
  subiendoEn = signal<string | null>(null);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.contenidoService.listarSemanas(this.cursoId).subscribe({
      next: (data) => {
        this.semanas.set(data || []);
        this.cargando.set(false);
        // Sugiere el próximo número de semana
        this.formSemana.numero = (data?.length || 0) + 1;
      },
      error: () => { this.semanas.set([]); this.cargando.set(false); }
    });
  }

  toggle(semanaId: string): void {
    this.expandida.set(this.expandida() === semanaId ? null : semanaId);
  }

  // ── Semanas ──
  abrirModalSemana(): void {
    this.formSemana = { numero: this.semanas().length + 1, titulo: '' };
    this.modalSemana.set(true);
  }

  crearSemana(): void {
    if (!this.formSemana.titulo.trim()) {
      this.toast.show('Escribe un título para la semana', 'warn');
      return;
    }
    this.guardandoSemana.set(true);
    this.contenidoService.crearSemana(this.cursoId, {
      numero: this.formSemana.numero,
      titulo: this.formSemana.titulo.trim()
    }).subscribe({
      next: () => {
        this.cargar();
        this.guardandoSemana.set(false);
        this.modalSemana.set(false);
        this.toast.show('Semana creada', 'ok');
      },
      error: (err) => {
        this.guardandoSemana.set(false);
        this.toast.show(err.error?.message || 'Error al crear la semana', 'error');
      }
    });
  }

  eliminarSemana(semana: any, event: Event): void {
    event.stopPropagation();
    if (!confirm(`¿Eliminar la semana "${semana.titulo}" y todos sus materiales?`)) return;
    this.contenidoService.eliminarSemana(semana.id).subscribe({
      next: () => {
        this.semanas.set(this.semanas().filter(s => s.id !== semana.id));
        this.toast.show('Semana eliminada', 'info');
      },
      error: () => { this.toast.show('Error al eliminar', 'error'); }
    });
  }

  // ── Materiales: archivo ──
  onArchivo(semana: any, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      this.toast.show('El archivo no debe superar 25MB', 'warn');
      input.value = '';
      return;
    }

    // Detectar tipo por extensión
    const tipo = this.detectarTipo(file.name);

    this.subiendoEn.set(semana.id);
    this.contenidoService.subirArchivo(semana.id, file, tipo).subscribe({
      next: () => {
        this.cargar();
        this.subiendoEn.set(null);
        this.toast.show('Material subido', 'ok');
      },
      error: (err) => {
        this.subiendoEn.set(null);
        this.toast.show(err.error?.message || 'Error al subir', 'error');
      }
    });
    input.value = '';
  }

  private detectarTipo(nombre: string): string {
    const ext = nombre.split('.').pop()?.toLowerCase() || '';
    if (ext === 'pdf') return 'PDF';
    if (['mp4', 'avi', 'mov', 'mkv'].includes(ext)) return 'VIDEO';
    return 'DOC';
  }

  // ── Materiales: link ──
  abrirModalLink(semana: any): void {
    this.semanaParaLink = semana;
    this.formLink = { nombre: '', url: '' };
    this.modalLink.set(true);
  }

  agregarLink(): void {
    if (!this.formLink.nombre.trim() || !this.formLink.url.trim()) {
      this.toast.show('Completa nombre y URL', 'warn');
      return;
    }
    this.guardandoLink.set(true);
    this.contenidoService.agregarLink(this.semanaParaLink.id, {
      nombre: this.formLink.nombre.trim(),
      url: this.formLink.url.trim()
    }).subscribe({
      next: () => {
        this.cargar();
        this.guardandoLink.set(false);
        this.modalLink.set(false);
        this.toast.show('Enlace agregado', 'ok');
      },
      error: (err) => {
        this.guardandoLink.set(false);
        this.toast.show(err.error?.message || 'Error al agregar', 'error');
      }
    });
  }

  eliminarMaterial(material: any, event: Event): void {
    event.stopPropagation();
    if (!confirm(`¿Eliminar "${material.nombre}"?`)) return;
    this.contenidoService.eliminarMaterial(material.id).subscribe({
      next: () => { this.cargar(); this.toast.show('Material eliminado', 'info'); },
      error: () => { this.toast.show('Error al eliminar', 'error'); }
    });
  }

  iconoTipo(tipo: string): string {
    const map: Record<string, string> = {
      PDF: 'ti-file-type-pdf', VIDEO: 'ti-video', DOC: 'ti-file-text', LINK: 'ti-link'
    };
    return map[tipo] || 'ti-file';
  }

  colorTipo(tipo: string): string {
    const map: Record<string, string> = {
      PDF: '#E53030', VIDEO: '#9B59B6', DOC: '#2A63E6', LINK: '#FF5B1F'
    };
    return map[tipo] || '#64748B';
  }
}