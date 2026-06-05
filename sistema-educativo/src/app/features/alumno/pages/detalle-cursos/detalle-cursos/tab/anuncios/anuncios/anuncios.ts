// anuncios.ts
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { AnuncioService } from '../../../../../../service/anuncios.service'; 

@Component({
  selector: 'app-anuncios-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './anuncios.html',
  styleUrl: './anuncios.css',
})
export class AnunciosTab implements OnInit {

  @Input() cursoId!: string;

  private anuncioService = inject(AnuncioService);

  cargando = true;
  anuncios: any[] = [];

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.anuncioService.listarPorCurso(this.cursoId).subscribe({
      next: (data) => {
        this.anuncios = data || [];
        this.cargando = false;
      },
      error: () => {
        this.anuncios = [];
        this.cargando = false;
      }
    });
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-PE', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
}