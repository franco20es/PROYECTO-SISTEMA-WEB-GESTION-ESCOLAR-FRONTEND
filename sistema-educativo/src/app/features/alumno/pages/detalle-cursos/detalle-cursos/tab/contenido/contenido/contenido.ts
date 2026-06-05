// contenido.ts
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { ToastService } from '../../../../../../../../core/services/toast/toast.service'; 
import { ContenidoService } from '../../../../../../service/contenido.service';

@Component({
  selector: 'app-contenido-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contenido.html',
  styleUrl: './contenido.css',
})
export class ContenidoTab implements OnInit {

  @Input() cursoId!: string;

  private contenidoService = inject(ContenidoService);
  private toast            = inject(ToastService);

  cargando = true;
  semanas: any[] = [];
  abierta: boolean[] = [];
  procesando: { [key: string]: boolean } = {};

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.contenidoService.listarSemanas(this.cursoId).subscribe({
      next: (data) => {
        this.semanas = data;
        this.abierta = data.map((_, i) => i === 0); // primera abierta
        this.cargando = false;
      },
      error: () => {
        this.semanas = [];
        this.cargando = false;
      }
    });
  }

  toggle(i: number): void {
    this.abierta[i] = !this.abierta[i];
  }

  iconoMaterial(tipo: string): string {
    const map: Record<string, string> = {
      PDF: 'ti-file-type-pdf',
      VIDEO: 'ti-video',
      DOC: 'ti-file-type-doc',
      LINK: 'ti-link',
    };
    return map[tipo] || 'ti-file';
  }

  claseIcono(tipo: string): string {
    return tipo.toLowerCase();
  }

  abrirMaterial(mat: any): void {
    // Si es LINK, abre la URL directa
    if (mat.tipo === 'LINK') {
      window.open(mat.url, '_blank');
      return;
    }

    this.procesando[mat.id] = true;
    this.contenidoService.verMaterial(mat.id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        this.procesando[mat.id] = false;
      },
      error: () => {
        this.toast.show('Error al abrir el material', 'error');
        this.procesando[mat.id] = false;
      }
    });
  }

  descargarMaterial(mat: any): void {
    if (mat.tipo === 'LINK') return;

    this.procesando[mat.id] = true;
    this.contenidoService.descargarMaterial(mat.id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = mat.nombre;
        a.click();
        URL.revokeObjectURL(url);
        this.procesando[mat.id] = false;
      },
      error: () => {
        this.toast.show('Error al descargar', 'error');
        this.procesando[mat.id] = false;
      }
    });
  }
}