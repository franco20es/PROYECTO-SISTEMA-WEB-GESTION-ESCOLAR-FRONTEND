// notas.ts
import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ModalAsistencia } from '../../../components/modales/modal-asistencia/modal-asistencia';
import { NotaService } from '../../../service/nota.service';

@Component({
  selector: 'app-notas',
  standalone: true,
  imports: [CommonModule, DecimalPipe, ModalAsistencia],
  templateUrl: './notas.html',
  styleUrl: './notas.css',
})
export class NotasAlumno implements OnInit {

  private notaService = inject(NotaService);

  expandedIndex: number | null = null;
  mostrarAsistencia = false;
  cursoSeleccionadoAsistencia: any = null;
  cargando = true;
  anio = new Date().getFullYear();

  periodo: any = null;
  notas: any[] = [];

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;

    // 1. Periodo activo + horario en paralelo
    forkJoin({
      periodo: this.notaService.getPeriodoActivo().pipe(catchError(() => of(null))),
      horario: this.notaService.getHorario(this.anio).pipe(catchError(() => of([])))
    }).subscribe(({ periodo, horario }) => {
      this.periodo = periodo;

      // 2. Agrupar cursos del horario
      const cursosMap = new Map<string, any>();
      (horario || []).forEach((h: any) => {
        if (!cursosMap.has(h.cursoId)) {
          cursosMap.set(h.cursoId, {
            cursoId: h.cursoId,
            curso: h.cursoNombre,
            codigo: h.cursoId.slice(0, 6).toUpperCase(),
            docente: h.docenteNombreCompleto,
            horario: `${this.abrevDia(h.diaSemana)}: ${h.horaInicio.slice(0,5)} - ${h.horaFin.slice(0,5)}`,
            modalidad: 'Presencial',
            seccion: h.seccionDenominacion,
            evaluaciones: [],
            promedio: null,
            sumaPesos: 0,
            todoCalificado: false,
          });
        }
      });

      const cursos = Array.from(cursosMap.values());

      if (!periodo || cursos.length === 0) {
        this.notas = cursos;
        this.cargando = false;
        return;
      }

      // 3. Por cada curso, traer sus evaluaciones del periodo activo (en paralelo)
      const llamadas = cursos.map(c =>
        this.notaService.getEvaluaciones(c.cursoId, periodo.id, this.anio)
          .pipe(catchError(() => of(null)))
      );

      forkJoin(llamadas).subscribe(resultados => {
        resultados.forEach((res, i) => {
          if (res) {
            cursos[i].evaluaciones = res.evaluaciones || [];
            cursos[i].sumaPesos    = res.sumaPesos || 0;
            const evals = cursos[i].evaluaciones;
            const calificadas = evals.filter((e: any) => e.estado === 'CALIFICADA').length;
            cursos[i].todoCalificado = evals.length > 0 && calificadas === evals.length;
            cursos[i].promedio = cursos[i].todoCalificado ? res.notaFinal : null;
            cursos[i].calificadas = calificadas;
          }
        });
        this.notas = cursos;
        this.cargando = false;
      });
    });
  }

  abrevDia(dia: string): string {
    const a: Record<string, string> = {
      LUNES: 'Lun', MARTES: 'Mar', MIERCOLES: 'Mié',
      JUEVES: 'Jue', VIERNES: 'Vie', SABADO: 'Sáb', DOMINGO: 'Dom'
    };
    return a[dia] || dia;
  }

  // Construye la fórmula ponderada: P1(20%) + P2(20%) + EF(40%)...
  formula(nota: any): string {
    if (!nota.evaluaciones || nota.evaluaciones.length === 0) return '—';
    return nota.evaluaciones
      .map((e: any) => `${e.nombre} (${e.peso}%)`)
      .join(' + ');
  }

  get promedio(): number {
    const conNota = this.notas.filter(n => n.promedio != null);
    if (conNota.length === 0) return 0;
    return conNota.reduce((sum, n) => sum + n.promedio, 0) / conNota.length;
  }

  colorNota(n: number | null): string {
    if (n == null) return '#8A95B0';
    if (n >= 15) return '#1D9E75';
    if (n >= 11) return '#BA7517';
    return '#A32D2D';
  }

  toggleAccordion(index: number): void {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

  verAsistencia(nota: any): void {
    this.cursoSeleccionadoAsistencia = nota;
    this.mostrarAsistencia = true;
  }

  cerrarAsistencia(): void {
    this.mostrarAsistencia = false;
    this.cursoSeleccionadoAsistencia = null;
  }
}