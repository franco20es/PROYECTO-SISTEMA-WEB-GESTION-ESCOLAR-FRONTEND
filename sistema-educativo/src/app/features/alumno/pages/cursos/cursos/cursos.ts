import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Toast } from '../../../../../core/components/toast/toast/toast';
import { ToastService } from '../../../../../core/services/toast/toast.service';
import { environment } from '../../../../../../environment/environment';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [CommonModule, Toast],
  templateUrl: './cursos.html',
  styleUrl: './cursos.css',
})
export class CursosAlumno implements OnInit {

  private http = inject(HttpClient);
  private api = environment.apiUrl;

  selectedCourse: any = null;
  activeTab: string = 'resumen';
  cargando = true;

  courses: any[] = [];

  constructor(
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarCursos();
  }

  showToast(msg: string, type: string = 'info') {
    this.toastService.show(msg, type);
  }

  cargarCursos(): void {
    const params = new HttpParams().set('anio', new Date().getFullYear());

    this.http.get<any[]>(`${this.api}/portal/alumno/horario`, { params }).subscribe({
      next: (horario) => {
        // Agrupar por cursoId para no repetir
        const cursosMap = new Map<string, any>();

        horario.forEach(h => {
          if (!cursosMap.has(h.cursoId)) {
            cursosMap.set(h.cursoId, {
              id: h.cursoId,
              nombre: h.cursoNombre,
              profesor: h.docenteNombreCompleto,
              horario: this.formatearHorario(h),
              dias: [h.diaSemana],
              horaInicio: h.horaInicio,
              horaFin: h.horaFin,
              seccionDenominacion: h.seccionDenominacion,
              progreso: 0,
              tags: [],
              img: this.getImagenCurso(h.cursoNombre),
              svgPath: this.getIconoCurso(h.cursoNombre),
              b1: '—', b2: '—', b3: '—', b4: '—', prom: '—',
              promClass: 'nota-b',
              resumen: { anuncios: [], logros: [] },
              tareas: [],
              evaluaciones: { proxima: null, historial: [], b1: '—', b2: '—', b3: '—', prom: '—' },
              material: { docs: [], videos: [] },
              foro: []
            });
          } else {
            // agregar días adicionales
            const curso = cursosMap.get(h.cursoId);
            if (!curso.dias.includes(h.diaSemana)) {
              curso.dias.push(h.diaSemana);
              curso.horario = this.formatearHorarioDias(curso.dias, h.horaInicio, h.horaFin);
            }
          }
        });

        this.courses = Array.from(cursosMap.values());
        this.cargando = false;
      },
      error: () => {
        this.showToast('Error al cargar los cursos', 'error');
        this.cargando = false;
      }
    });
  }

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

  getIconoCurso(nombre: string): string {
    const iconos: Record<string, string> = {
      'Matemática': 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z',
      'Comunicación': 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z',
      'Inglés': 'M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04z',
    };
    return iconos[nombre] || 'M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8z';
  }

  onOpenCourse(course: any) {
    if (this.selectedCourse?.id === course.id) {
      this.selectedCourse = null;
    } else {
      this.selectedCourse = course;
      this.activeTab = 'resumen';
    }
  }
}