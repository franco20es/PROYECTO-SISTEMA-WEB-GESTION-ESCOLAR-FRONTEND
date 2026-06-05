// silabo.ts
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { ToastService } from '../../../../../../../../core/services/toast/toast.service'; 
import { SilaboService } from '../../../../../../service/silabo.service'; 

@Component({
  selector: 'app-silabo-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './silabo.html',
  styleUrl: './silabo.css',
})
export class SilaboTab implements OnInit {

  @Input() cursoId!: string;

  private silaboService = inject(SilaboService);
  private toast         = inject(ToastService);

  cargando = true;
  silabo: any = null;
  descargando = false;
  abriendo = false;

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.silaboService.getPorCurso(this.cursoId).subscribe({
      next: (data) => {
        this.silabo = {
          id: data.id,
          nombre: data.nombreArchivo,
          fecha: new Date(data.fechaSubida).toLocaleDateString('es-PE', {
            day: '2-digit', month: 'short', year: 'numeric'
          }),
          tamanio: data.tamanio
        };
        this.cargando = false;
      },
      error: () => {
        this.silabo = null;   // curso sin sílabo
        this.cargando = false;
      }
    });
  }

  ver(): void {
    if (!this.silabo) return;
    this.abriendo = true;
    this.silaboService.ver(this.silabo.id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        this.abriendo = false;
      },
      error: () => {
        this.toast.show('Error al abrir el sílabo', 'error');
        this.abriendo = false;
      }
    });
  }

  descargar(): void {
    if (!this.silabo) return;
    this.descargando = true;
    this.silaboService.descargar(this.silabo.id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.silabo.nombre;
        a.click();
        URL.revokeObjectURL(url);
        this.descargando = false;
      },
      error: () => {
        this.toast.show('Error al descargar', 'error');
        this.descargando = false;
      }
    });
  }
}