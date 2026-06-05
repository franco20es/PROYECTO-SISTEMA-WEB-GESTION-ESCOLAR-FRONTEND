// evaluaciones.ts
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../../../../../../../../core/services/toast/toast.service';
import { EvaluacionService } from '../../../../../../service/evaluacion.service';

@Component({
  selector: 'app-evaluaciones-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './evaluaciones.html',
  styleUrl: './evaluaciones.css',
})
export class EvaluacionesTab implements OnInit {

  @Input() cursoId!: string;

  private evalService = inject(EvaluacionService);
  private toast       = inject(ToastService);
  private router      = inject(Router);

  anio = new Date().getFullYear();

  cargandoPeriodos = true;
  cargandoEval     = false;

  periodos: any[] = [];
  periodoSeleccionado: string = '';

  evaluaciones: any[] = [];
  notaFinal: number | null = null;
  sumaPesos = 0;
  tieneComponentes = false;

  // Exámenes en línea
  examenes: any[] = [];

  ngOnInit(): void {
    this.cargarPeriodos();
    this.cargarExamenes();
  }

  cargarPeriodos(): void {
    this.cargandoPeriodos = true;
    this.evalService.getPeriodos(this.anio).subscribe({
      next: (data) => {
        this.periodos = data || [];
        this.cargandoPeriodos = false;
        if (this.periodos.length > 0) {
          this.periodoSeleccionado = this.periodos[0].id;
          this.cargarEvaluaciones();
        }
      },
      error: () => {
        this.periodos = [];
        this.cargandoPeriodos = false;
      }
    });
  }

  cargarExamenes(): void {
    this.evalService.getExamenes(this.cursoId).subscribe({
      next: (data) => { this.examenes = data || []; },
      error: () => { this.examenes = []; }
    });
  }

  onCambiarPeriodo(periodoId: string): void {
    this.periodoSeleccionado = periodoId;
    this.cargarEvaluaciones();
  }

  cargarEvaluaciones(): void {
    if (!this.periodoSeleccionado) return;
    this.cargandoEval = true;
    this.evalService.misEvaluaciones(this.cursoId, this.periodoSeleccionado, this.anio).subscribe({
      next: (res) => {
        this.evaluaciones     = res.evaluaciones || [];
        this.notaFinal        = res.notaFinal;
        this.sumaPesos        = res.sumaPesos || 0;
        this.tieneComponentes = res.tieneComponentes || false;
        this.cargandoEval = false;
      },
      error: () => {
        this.evaluaciones = [];
        this.tieneComponentes = false;
        this.cargandoEval = false;
      }
    });
  }

  // Navega a la vista de rendir examen
  rendirExamen(examen: any): void {
    if (examen.yaRindio) {
      this.toast.show('Ya rendiste este examen', 'info');
      return;
    }
    this.router.navigate(['/alumno/examen', examen.id], {
      queryParams: { cursoId: this.cursoId, anio: this.anio }
    });
  }

  // Cuántas evaluaciones ya tienen nota
  get calificadas(): number {
    return this.evaluaciones.filter(e => e.estado === 'CALIFICADA').length;
  }

  get todoCalificado(): boolean {
    return this.tieneComponentes &&
           this.evaluaciones.length > 0 &&
           this.calificadas === this.evaluaciones.length;
  }

  colorNota(n: number | null): string {
    if (n == null) return '#94A3B8';
    if (n >= 15) return '#1D9E75';
    if (n >= 11) return '#BA7517';
    return '#A32D2D';
  }

  aporte(ev: any): string {
    if (ev.nota == null) return '—';
    return (ev.nota * ev.peso / 100).toFixed(2);
  }
}