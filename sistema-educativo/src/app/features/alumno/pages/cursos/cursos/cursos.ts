// cursos.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Toast } from '../../../../../core/components/toast/toast/toast';
import { ToastService } from '../../../../../core/services/toast/toast.service';
import { CursoService } from '../../../service/curso.service';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [CommonModule, Toast],
  templateUrl: './cursos.html',
  styleUrl: './cursos.css',
})
export class CursosAlumno implements OnInit {

  private cursoService = inject(CursoService);
  private toastService = inject(ToastService);
  private router       = inject(Router);

  selectedCourse: any = null;
  activeTab = 'resumen';
  cargando  = true;
  anio      = new Date().getFullYear();
  courses: any[] = [];

  private readonly COLORES = [
    '#1340A0','#10B981','#F59E0B','#8B5CF6','#EF4444','#06B6D4','#EC4899'
  ];
  private colorIdx = 0;

  // ─── Lifecycle ────────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.cargarCursos();
  }

  // ─── Carga de datos ───────────────────────────────────────────────────────

  cargarCursos(): void {
    this.cargando = true;

    // Cargar horario y notas en paralelo
    forkJoin({
      horario: this.cursoService.getMiHorario(this.anio),
      notas:   this.cursoService.getMisNotas(this.anio)
    }).subscribe({
      next: ({ horario, notas }) => {
        const notasContent: any[] = notas?.content || [];
        this.courses = this.construirCursos(horario, notasContent);
        this.cargando = false;
      },
      error: () => {
        // Si falla notas, carga solo el horario
        this.cursoService.getMiHorario(this.anio).subscribe({
          next: (horario) => {
            this.courses = this.construirCursos(horario, []);
            this.cargando = false;
          },
          error: () => {
            this.showToast('Error al cargar los cursos', 'error');
            this.cargando = false;
          }
        });
      }
    });
  }

  private construirCursos(horario: any[], notas: any[]): any[] {
    const cursosMap = new Map<string, any>();

    horario.forEach(h => {
      if (!cursosMap.has(h.cursoId)) {
        cursosMap.set(h.cursoId, {
          id:                  h.cursoId,
          nombre:              h.cursoNombre,
          profesor:            h.docenteNombreCompleto,
          horario:             this.formatearHorario(h),
          dias:                [h.diaSemana],
          horaInicio:          h.horaInicio,
          horaFin:             h.horaFin,
          seccionDenominacion: h.seccionDenominacion,
          color:               this.COLORES[this.colorIdx++ % this.COLORES.length],
          progreso:            0,
          tags:                [],
          img:                 this.getImagenCurso(h.cursoNombre),
          b1: '—', b2: '—', b3: '—', b4: '—', prom: '—',
        });
      } else {
        const curso = cursosMap.get(h.cursoId);
        if (!curso.dias.includes(h.diaSemana)) {
          curso.dias.push(h.diaSemana);
          curso.horario = this.formatearHorarioDias(curso.dias, h.horaInicio, h.horaFin);
        }
      }
    });

    // Mapear notas por curso y bimestre
    notas.forEach(n => {
      if (cursosMap.has(n.cursoId)) {
        const curso = cursosMap.get(n.cursoId);
        const key = `b${n.numeroBimestre}`;
        if (['b1','b2','b3','b4'].includes(key)) {
          curso[key] = n.calificacion?.toFixed(1) || '—';
        }
      }
    });

    // Calcular promedio por curso
    cursosMap.forEach(curso => {
      const vals = [curso.b1, curso.b2, curso.b3, curso.b4]
        .filter(v => v !== '—')
        .map(v => parseFloat(v));

      if (vals.length > 0) {
        const prom = vals.reduce((a, b) => a + b, 0) / vals.length;
        curso.prom = prom.toFixed(1);
        curso.progreso = Math.min(Math.round((vals.length / 4) * 100), 100);
      }
    });

    return Array.from(cursosMap.values());
  }

  // ─── Acciones ─────────────────────────────────────────────────────────────

 onOpenCourse(course: any): void {
  sessionStorage.setItem('cursosAlumno', JSON.stringify(this.courses));
  this.router.navigate(['/alumno/detalle-curso', course.id]);
}

  // ─── Helpers ──────────────────────────────────────────────────────────────

  formatearHorario(h: any): string {
    const dia = h.diaSemana.charAt(0) + h.diaSemana.slice(1).toLowerCase().slice(0, 2);
    return `${dia} · ${h.horaInicio.slice(0,5)} – ${h.horaFin.slice(0,5)}`;
  }

  formatearHorarioDias(dias: string[], inicio: string, fin: string): string {
    const abrev = dias.map((d: string) =>
      d.charAt(0) + d.slice(1).toLowerCase().slice(0, 2)
    ).join(', ');
    return `${abrev} · ${inicio.slice(0,5)} – ${fin.slice(0,5)}`;
  }

  getImagenCurso(nombre: string): string {
    return 'https://res.cloudinary.com/dgrdonnsk/image/upload/v1778542490/Gemini_Generated_Image_cyvc04cyvc04cyvc_nmcyun.png';
  }

  showToast(msg: string, type = 'info'): void {
    this.toastService.show(msg, type);
  }
}