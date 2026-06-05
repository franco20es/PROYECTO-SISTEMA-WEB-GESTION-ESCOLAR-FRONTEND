// silabo-docente.ts
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { SilaboDocenteService } from '../../../../../../services/silabo.service'; 
import { ToastService } from '../../../../../../../../core/services/toast/toast.service';

@Component({
  selector: 'app-silabo-docente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './silabo.html',
  styleUrl: './silabo.css',
})
export class SilaboDocente implements OnInit {

  @Input() cursoId!: string;

  private silaboService = inject(SilaboDocenteService);
  private toast         = inject(ToastService);

  cargando = signal(true);
  silabo   = signal<any | null>(null);
  subiendo = signal(false);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.silaboService.getPorCurso(this.cursoId).subscribe({
      next: (data) => { this.silabo.set(data || null); this.cargando.set(false); },
      error: () => { this.silabo.set(null); this.cargando.set(false); }
    });
  }

  onArchivoSeleccionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    // Validar PDF
    if (file.type !== 'application/pdf') {
      this.toast.show('Solo se permiten archivos PDF', 'warn');
      input.value = '';
      return;
    }
    // Validar tamaño (25MB)
    if (file.size > 25 * 1024 * 1024) {
      this.toast.show('El archivo no debe superar 25MB', 'warn');
      input.value = '';
      return;
    }

    this.subir(file);
    input.value = '';
  }

  subir(file: File): void {
    this.subiendo.set(true);
    this.silaboService.subir(this.cursoId, file).subscribe({
      next: (data) => {
        this.silabo.set(data);
        this.subiendo.set(false);
        this.toast.show('Sílabo subido correctamente', 'ok');
      },
      error: (err) => {
        this.subiendo.set(false);
        this.toast.show(err.error?.message || 'Error al subir el sílabo', 'error');
      }
    });
  }

  verSilabo(): void {
    const s = this.silabo();
    if (!s) return;
    this.silaboService.ver(s.id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      },
      error: () => { this.toast.show('No se pudo abrir el sílabo', 'error'); }
    });
  }

  descargarSilabo(): void {
    const s = this.silabo();
    if (!s) return;
    this.silaboService.descargar(s.id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = s.nombreArchivo || 'silabo.pdf';
        a.click();
        URL.revokeObjectURL(url);
      },
      error: () => { this.toast.show('No se pudo descargar', 'error'); }
    });
  }

  eliminarSilabo(): void {
    if (!confirm('¿Eliminar el sílabo de este curso?')) return;
    this.silaboService.eliminar(this.cursoId).subscribe({
      next: () => {
        this.silabo.set(null);
        this.toast.show('Sílabo eliminado', 'info');
      },
      error: () => { this.toast.show('Error al eliminar', 'error'); }
    });
  }
}