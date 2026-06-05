// asistencia.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AsistenciaService } from '../../../service/asistencia.service';

export interface Curso {
  cursoId: string;
  name: string;
  color: string;
  prof: string;
  total: number;
  p: number; t: number; f: number; j: number;
  pct: number;
}

export interface HistorialItem {
  fecha: string;    // dd/mm/yyyy
  dia: string;
  estado: 'P' | 'T' | 'F' | 'J';
  obs: string;
  rawFecha: string; // yyyy-mm-dd
}

@Component({
  selector: 'app-asistencia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'asistencia.html',
  styleUrls: ['asistencia.css']
})
export class AsistenciaAlumno implements OnInit {

  private asistenciaService = inject(AsistenciaService);

  anio = new Date().getFullYear();
  cargando = true;

  // Paleta de colores para asignar a cursos
  private COLORES = ['#2A63E6', '#FF5B1F', '#00C27C', '#9B59B6', '#F5A623', '#E53030'];

  CURSOS: Curso[] = [];
  DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  // Estado UI
  activeCurso: Curso | null = null;
  activeTab = 0;
  historialActiveCurso: HistorialItem[] = [];
  cargandoDetalle = false;

  // Resumen general
  totalP = 0; totalT = 0; totalF = 0; totalJ = 0; totalAll = 0; gPct = 0;

  ngOnInit() {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.asistenciaService.miAsistencia(this.anio)
      .pipe(catchError(() => of([])))
      .subscribe((data: any[]) => {
        this.CURSOS = (data || []).map((c, i) => ({
          cursoId: c.cursoId,
          name: c.cursoNombre,
          color: this.COLORES[i % this.COLORES.length],
          prof: c.docenteNombre,
          total: c.totalSesiones,
          p: c.presente,
          t: c.tardanza,
          f: c.ausente,
          j: c.justificado,
          pct: c.porcentajeAsistencia
        }));
        this.calcularResumenGeneral();
        this.cargando = false;
      });
  }

  calcularResumenGeneral() {
    this.totalP = this.totalT = this.totalF = this.totalJ = this.totalAll = 0;
    this.CURSOS.forEach(c => {
      this.totalP += c.p; this.totalT += c.t;
      this.totalF += c.f; this.totalJ += c.j;
      this.totalAll += c.total;
    });
    // % general: presente + tardanza cuentan como asistió
    this.gPct = this.totalAll
      ? Math.round(((this.totalP + this.totalT) / this.totalAll) * 100)
      : 0;
  }

  // Mapea el estado del backend a la letra de la vista
  private mapEstado(estado: string): 'P' | 'T' | 'F' | 'J' {
    switch (estado) {
      case 'PRESENTE':    return 'P';
      case 'TARDANZA':    return 'T';
      case 'AUSENTE':     return 'F';
      case 'JUSTIFICADO': return 'J';
      default:            return 'F';
    }
  }

  pct(p: number, total: number): number {
    return total ? Math.round((p / total) * 100) : 0;
  }

  pctColor(v: number): string {
    return v >= 90 ? 'var(--ok)' : v >= 75 ? 'var(--wa)' : 'var(--er)';
  }

  ringDash(pct: number, r: number): string {
    const c = 2 * Math.PI * r;
    return `${(c * pct) / 100} ${(c * (100 - pct)) / 100}`;
  }

  openCurso(curso: Curso) {
    this.activeCurso = curso;
    this.activeTab = 0;
    this.cargandoDetalle = true;
    this.historialActiveCurso = [];

    this.asistenciaService.miAsistenciaCurso(curso.cursoId, this.anio)
      .pipe(catchError(() => of([])))
      .subscribe((data: any[]) => {
        this.historialActiveCurso = (data || []).map(a => {
          const d = new Date(a.fecha + 'T00:00:00');
          return {
            rawFecha: a.fecha,
            fecha: this.formatFecha(a.fecha),
            dia: this.DIAS[d.getDay()],
            estado: this.mapEstado(a.estado),
            obs: a.motivo || ''
          } as HistorialItem;
        });
        this.cargandoDetalle = false;
      });

    setTimeout(() => {
      document.getElementById('detail')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }

  private formatFecha(iso: string): string {
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
  }

  // Agrupa el historial por mes (para la pestaña "Por mes")
  get resumenPorMes() {
    const meses: Record<string, { nm: string; p: number; t: number; f: number; j: number; total: number }> = {};
    const nombresMes = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    this.historialActiveCurso.forEach(h => {
      const mesIdx = parseInt(h.rawFecha.split('-')[1]) - 1;
      const key = nombresMes[mesIdx];
      if (!meses[key]) meses[key] = { nm: key, p:0, t:0, f:0, j:0, total:0 };
      meses[key].total++;
      if (h.estado === 'P') meses[key].p++;
      else if (h.estado === 'T') meses[key].t++;
      else if (h.estado === 'F') meses[key].f++;
      else if (h.estado === 'J') meses[key].j++;
    });
    return Object.values(meses);
  }

  closeDetail() {
    this.activeCurso = null;
    this.historialActiveCurso = [];
  }

  swDt(tabIndex: number) {
    this.activeTab = tabIndex;
  }
}