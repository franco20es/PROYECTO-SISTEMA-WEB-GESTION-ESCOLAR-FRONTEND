// detalle-cursos.ts — CONTENEDOR (hero + tabs)
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CursoService } from '../../../service/curso.service';

// Componentes de cada tab
import { SilaboTab } from './tab/silabo/silabo/silabo'; 
import { ContenidoTab } from './tab/contenido/contenido/contenido'; 
import { TareasTab } from './tab/tareas/tareas/tareas';
import { EvaluacionesTab } from './tab/evaluaciones/evaluaciones/evaluaciones'; 
import { AnunciosTab } from './tab/anuncios/anuncios/anuncios'; 
import { ForoTab } from './tab/foro/foro/foro';

@Component({
  selector: 'app-detalle-cursos',
  standalone: true,
  imports: [
    CommonModule,
    SilaboTab, ContenidoTab, TareasTab,
    EvaluacionesTab, AnunciosTab, ForoTab
  ],
  templateUrl: './detalle-cursos.html',
  styleUrl: './detalle-cursos.css',
})
export class DetalleCursos implements OnInit {

  private route        = inject(ActivatedRoute);
  private router       = inject(Router);
  private cursoService = inject(CursoService);

  cargando = true;
  anio     = new Date().getFullYear();
  cursoId  = '';
  curso: any = null;

  tabs = [
    { key: 'silabo',       label: 'Sílabo',       icon: 'ti-file-description' },
    { key: 'contenido',    label: 'Contenido',    icon: 'ti-layout-list' },
    { key: 'tareas',       label: 'Tareas',       icon: 'ti-file-text' },
    { key: 'evaluaciones', label: 'Evaluaciones', icon: 'ti-clipboard-check' },
    { key: 'anuncios',     label: 'Anuncios',     icon: 'ti-speakerphone' },
    { key: 'foro',         label: 'Foro',         icon: 'ti-messages' },
  ];
  tabActiva = 'silabo';

 ngOnInit(): void {
  this.cursoId = this.route.snapshot.params['id'];

  // Si viene un tab en la URL (desde una notificación), ábrelo
  const tab = this.route.snapshot.queryParams['tab'];
  if (tab && this.tabs.some(t => t.key === tab)) {
    this.tabActiva = tab;
  }

  this.cargarCurso();
}

  cargarCurso(): void {
    this.cargando = true;

    // Curso desde sessionStorage (cargado en mis-cursos)
    const data = sessionStorage.getItem('cursosAlumno');
    if (data) {
      const cursos = JSON.parse(data);
      const found = cursos.find((c: any) => c.id === this.cursoId);
      if (found) this.curso = this.enriquecer(found);
    }

    // Notas reales para el promedio
    this.cursoService.getMisNotas(this.anio).subscribe({
      next: (res) => {
        const notas = (res?.content || []).filter((n: any) => n.cursoId === this.cursoId);
        if (this.curso) {
          const vals = notas.map((n: any) => n.calificacion).filter((v: any) => v != null);
          this.curso.promedio = vals.length
            ? +(vals.reduce((a: number, b: number) => a + b, 0) / vals.length).toFixed(1)
            : 0;
        }
        this.cargando = false;
      },
      error: () => { this.cargando = false; }
    });
  }

  private enriquecer(curso: any): any {
    const p = curso.profesor?.split(' ') || [];
    const ini = p.length >= 2 ? p[0][0] + p[1][0] : (curso.nombre?.[0] || 'C');
    return { ...curso, iniciales: ini.toUpperCase(), asistencia: 94, promedio: +curso.prom || 0 };
  }

  setTab(key: string): void { this.tabActiva = key; }
  volverACursos(): void { this.router.navigate(['/alumno/cursos']); }
}