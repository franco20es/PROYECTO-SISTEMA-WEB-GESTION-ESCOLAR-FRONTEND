// detalle-curso-docente.ts — CONTENEDOR (hero + tabs) del DOCENTE
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// Tabs conectados
import { AnunciosDocente } from '../taps/anuncios/anuncios/anuncios'; 
import { SilaboDocente } from '../taps/silabo/silabo/silabo'; 
import { ContenidoDocente } from '../taps/contenido/contenido/contenido';
import { TareasDocente } from '../taps/tareas/tareas/tareas';
import { EvaluacionDocenteService } from '../../../../services/evaluacion.service';
import { EvaluacionesDocente } from '../taps/evaluaciones/evaluaciones/evaluaciones';
import { ForoDocente } from '../taps/foro/foro/foro';

@Component({
  selector: 'app-detalle-curso-docente',
  standalone: true,
  imports: [CommonModule, AnunciosDocente, SilaboDocente,ContenidoDocente,TareasDocente,EvaluacionesDocente,ForoDocente],
  templateUrl: './detalle-curso.html',
  styleUrl: './detalle-curso.css',
})
export class DetalleCursoDocente implements OnInit {

  private route  = inject(ActivatedRoute);
  private router = inject(Router);

  cursoId = '';
  curso: any = null;

  tabs = [
    { key: 'silabo',       label: 'Sílabo',       icon: 'ti-file-description' },
    { key: 'contenido',    label: 'Contenido',    icon: 'ti-layout-list' },
    { key: 'tareas',       label: 'Tareas',       icon: 'ti-file-text' },
    { key: 'evaluaciones', label: 'Evaluaciones', icon: 'ti-clipboard-check' },
    { key: 'anuncios',     label: 'Anuncios',     icon: 'ti-speakerphone' },
    { key: 'foro',         label: 'Foro',         icon: 'ti-messages' },
  ];
  tabActiva = 'anuncios';   // arranca en anuncios (el conectado)

  ngOnInit(): void {
    this.cursoId = this.route.snapshot.params['id'];

    const tab = this.route.snapshot.queryParams['tab'];
    if (tab && this.tabs.some(t => t.key === tab)) {
      this.tabActiva = tab;
    }

    // Curso desde sessionStorage (cargado en mis-cursos del docente)
    const data = sessionStorage.getItem('cursosDocente');
    if (data) {
      const cursos = JSON.parse(data);
      this.curso = cursos.find((c: any) => c.id === this.cursoId) || null;
    }
    if (!this.curso) {
      this.curso = { id: this.cursoId, name: 'Curso', codigo: '', secs: [], color: '#1340A0' };
    }
  }

  setTab(key: string): void { this.tabActiva = key; }

  volver(): void { this.router.navigate(['/profesor/cursos']); }
}