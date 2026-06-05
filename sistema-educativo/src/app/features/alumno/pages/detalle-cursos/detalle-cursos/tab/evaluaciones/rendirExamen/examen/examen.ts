// rendir-examen.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../../../../../../../core/services/toast/toast.service'; 
import { Toast } from '../../../../../../../../../core/components/toast/toast/toast'; 
import { ExamenService } from '../../../../../../../service/examen.service';

@Component({
  selector: 'app-rendir-examen',
  standalone: true,
  imports: [CommonModule, Toast],
  templateUrl: './examen.html',
  styleUrl: './examen.css',
})
export class RendirExamen implements OnInit {

  private route       = inject(ActivatedRoute);
  private router      = inject(Router);
  private examenSrv   = inject(ExamenService);
  private toast       = inject(ToastService);

  anio = new Date().getFullYear();
  examenId = '';
  cursoId  = '';

  cargando = true;
  enviando = false;
  examen: any = null;

  // respuestas[preguntaId] = alternativaId
  respuestas: { [preguntaId: string]: string } = {};

  // Pantalla de resultado
  resultado: any = null;

  // Confirmación antes de enviar
  mostrarConfirm = false;

  ngOnInit(): void {
    this.examenId = this.route.snapshot.params['examenId'];
    this.cursoId  = this.route.snapshot.queryParams['cursoId'] || '';
    const a = this.route.snapshot.queryParams['anio'];
    if (a) this.anio = +a;
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.examenSrv.rendir(this.examenId, this.anio).subscribe({
      next: (data) => {
        this.examen = data;
        this.cargando = false;
      },
      error: (err) => {
        this.cargando = false;
        this.toast.show(err.error?.message || 'No se pudo abrir el examen', 'error');
        this.volver();
      }
    });
  }

  seleccionar(preguntaId: string, alternativaId: string): void {
    this.respuestas[preguntaId] = alternativaId;
  }

  estaSeleccionada(preguntaId: string, alternativaId: string): boolean {
    return this.respuestas[preguntaId] === alternativaId;
  }

  letra(i: number): string {
    return String.fromCharCode(65 + i); // A, B, C...
  }

  get totalRespondidas(): number {
    return Object.keys(this.respuestas).length;
  }

  get progreso(): number {
    if (!this.examen?.totalPreguntas) return 0;
    return (this.totalRespondidas / this.examen.totalPreguntas) * 100;
  }

  get todasRespondidas(): boolean {
    return this.examen && this.totalRespondidas === this.examen.totalPreguntas;
  }

  abrirConfirm(): void {
    if (!this.todasRespondidas) {
      this.toast.show('Responde todas las preguntas antes de enviar', 'warn');
      return;
    }
    this.mostrarConfirm = true;
  }

  cerrarConfirm(): void {
    this.mostrarConfirm = false;
  }

  enviar(): void {
    this.mostrarConfirm = false;
    this.enviando = true;

    const payload = Object.keys(this.respuestas).map(preguntaId => ({
      preguntaId,
      alternativaId: this.respuestas[preguntaId]
    }));

    this.examenSrv.entregar(this.examenId, this.anio, payload).subscribe({
      next: (res) => {
        this.resultado = res;
        this.enviando = false;
      },
      error: (err) => {
        this.enviando = false;
        this.toast.show(err.error?.message || 'Error al enviar el examen', 'error');
      }
    });
  }

  volver(): void {
    if (this.cursoId) {
      this.router.navigate(['/alumno/detalle-curso', this.cursoId]);
    } else {
      this.router.navigate(['/alumno/cursos']);
    }
  }

  colorNota(n: number): string {
    if (n >= 15) return '#1D9E75';
    if (n >= 11) return '#BA7517';
    return '#A32D2D';
  }
}