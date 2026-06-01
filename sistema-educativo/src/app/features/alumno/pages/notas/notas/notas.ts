import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ModalAsistencia } from '../../../components/modales/modal-asistencia/modal-asistencia';
import { environment } from '../../../../../../environment/environment';

@Component({
  selector: 'app-notas',
  standalone: true,
  imports: [CommonModule, DecimalPipe, ModalAsistencia],
  templateUrl: './notas.html',
  styleUrl: './notas.css',
})
export class NotasAlumno implements OnInit {

  private http = inject(HttpClient);
  private api = environment.apiUrl;

  expandedIndex: number | null = null;
  mostrarAsistencia = false;
  cursoSeleccionadoAsistencia: any = null;
  cargando = true;
  anio = new Date().getFullYear();

  notas: any[] = [];

  ngOnInit(): void {
    this.cargarNotas();
  }

  cargarNotas(): void {
    const anioParam = new HttpParams().set('anio', this.anio);

    // Cargar horario y notas en paralelo
    Promise.all([
      this.http.get<any[]>(`${this.api}/portal/alumno/horario`, { params: anioParam }).toPromise(),
      this.http.get<any>(`${this.api}/portal/alumno/notas`, {
        params: new HttpParams().set('anio', this.anio).set('page', 0).set('size', 50)
      }).toPromise()
    ]).then(([horario, notasRes]) => {
      const notasContent: any[] = notasRes?.content || [];

      // Agrupar horario por curso
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
            horasSemanales: 2.0,
            creditos: 2.0,
            nroVez: 1,
            seccion: h.seccionDenominacion,
            b1: '—', b2: '—', b3: '—', b4: '—',
            promedio: null,
            asistencia: { asistio: 0, noAsistio: 0, pendiente: 0, sinRegistro: 0, calendario: [] }
          });
        }
      });

      // Mapear notas por curso y bimestre
      notasContent.forEach((n: any) => {
        if (cursosMap.has(n.cursoId)) {
          const curso = cursosMap.get(n.cursoId);
          const key = `b${n.numeroBimestre}`;
          curso[key] = n.calificacion?.toFixed(1) || '—';
          curso.docente = n.docenteNombreCompleto;
        }
      });

      // Calcular promedio por curso
      cursosMap.forEach(curso => {
        const bimestres = [curso.b1, curso.b2, curso.b3, curso.b4]
          .filter((b: string) => b !== '—')
          .map((b: string) => parseFloat(b));
        curso.promedio = bimestres.length > 0
          ? bimestres.reduce((a: number, b: number) => a + b, 0) / bimestres.length
          : null;
      });

      this.notas = Array.from(cursosMap.values());
      this.cargando = false;
    }).catch(() => {
      this.cargando = false;
    });
  }

  abrevDia(dia: string): string {
    const abrevs: Record<string, string> = {
      LUNES: 'Lun', MARTES: 'Mar', MIERCOLES: 'Mié',
      JUEVES: 'Jue', VIERNES: 'Vie', SABADO: 'Sáb', DOMINGO: 'Dom'
    };
    return abrevs[dia] || dia;
  }

  get promedio(): number {
    const conNota = this.notas.filter(n => n.promedio !== null);
    if (conNota.length === 0) return 0;
    return conNota.reduce((sum, n) => sum + n.promedio, 0) / conNota.length;
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