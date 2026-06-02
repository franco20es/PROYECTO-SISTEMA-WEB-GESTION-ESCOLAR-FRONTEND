// detalle-cursos.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { Toast } from '../../../../../core/components/toast/toast/toast';
import { ToastService } from '../../../../../core/services/toast/toast.service';
import { CursoService } from '../../../service/curso.service';

@Component({
  selector: 'app-detalle-cursos',
  standalone: true,
  imports: [CommonModule, FormsModule, Toast],
  templateUrl: './detalle-cursos.html',
  styleUrl: './detalle-cursos.css',
})
export class DetalleCursos implements OnInit, OnDestroy {

  private destroy$     = new Subject<void>();
  private route        = inject(ActivatedRoute);
  private router       = inject(Router);
  private cursoService = inject(CursoService);
  private toastService = inject(ToastService);

  // ─── Estado ───────────────────────────────────────────────────────────────
  cargando = true;
  anio     = new Date().getFullYear();
  cursoId  = '';
  curso: any = null;

  // Tabs
  tabs = [
    { key: 'silabo',       label: 'Sílabo',        icon: 'ti-books' },
    { key: 'contenido',    label: 'Contenido',      icon: 'ti-layout-list' },
    { key: 'tareas',       label: 'Tareas',         icon: 'ti-file-text' },
    { key: 'evaluaciones', label: 'Evaluaciones',   icon: 'ti-clipboard' },
    { key: 'anuncios',     label: 'Anuncios',       icon: 'ti-speakerphone' },
    { key: 'foro',         label: 'Foro',           icon: 'ti-message-circle' },
  ];
  tabActiva = 'silabo';

  // Datos
  bimestres:    any[] = [];
  contenido:    any[] = [];
  bimAbiert:    boolean[] = [];
  tareas:       any[] = [];
  evaluaciones: any[] = [];
  anuncios:     any[] = [];
  foro:         any[] = [];

  // Modal tarea
  modalTareaVisible = false;
  tareaSeleccionada: any = null;
  archivoEntrega: File | null = null;
  comentarioEntrega = '';
  entregando = false;
  entregaExitosa = false;

  // Modal foro
  modalForoVisible = false;
  preguntaForo = '';

  // ─── Lifecycle ────────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(p => {
      this.cursoId = p['id'];
      this.cargarDetalle();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ─── Carga de datos ───────────────────────────────────────────────────────

  cargarDetalle(): void {
    this.cargando = true;

    // Lee el curso desde sessionStorage (ya cargado en mis-cursos)
    const cursosData = sessionStorage.getItem('cursosAlumno');
    if (cursosData) {
      const cursos = JSON.parse(cursosData);
      const found = cursos.find((c: any) => c.id === this.cursoId);
      if (found) {
        this.curso = this.enriquecerCurso(found);
      }
    }

    // Carga notas para llenar bimestres
    forkJoin({
      notas: this.cursoService.getMisNotas(this.anio)
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: ({ notas }) => {
        const notasContent = notas?.content || [];
        this.construirBimestres(notasContent);
        this.construirContenido();
        this.cargarMocks();
        this.cargando = false;
      },
      error: () => {
        this.construirBimestres([]);
        this.construirContenido();
        this.cargarMocks();
        this.cargando = false;
      }
    });
  }

  private enriquecerCurso(curso: any): any {
    const partes = curso.profesor?.split(' ') || [];
    const iniciales = partes.length >= 2
      ? partes[0][0] + partes[1][0]
      : curso.nombre?.[0] || 'C';
    return {
      ...curso,
      iniciales: iniciales.toUpperCase(),
      asistencia: 94,
      promedio: +curso.prom || 0,
    };
  }

  private construirBimestres(notas: any[]): void {
    const notasCurso = notas.filter(n => n.cursoId === this.cursoId);
    const labels = ['1° Bimestre', '2° Bimestre', '3° Bimestre', '4° Bimestre'];
    const estados = ['Completado', 'En curso', 'Próximo', 'Próximo'];

    this.bimestres = labels.map((label, i) => {
      const num = i + 1;
      const nota = notasCurso.find(n => n.numeroBimestre === num);
      return {
        label,
        nota: nota ? nota.calificacion?.toFixed(1) : '—',
        estado: estados[i],
      };
    });

    if (this.curso) {
      this.curso.promedio = this.calcularPromedio(this.bimestres);
    }
  }

  private calcularPromedio(bimestres: any[]): number {
    const vals = bimestres
      .filter(b => b.nota !== '—')
      .map(b => parseFloat(b.nota));
    if (!vals.length) return 0;
    return parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1));
  }

  private construirContenido(): void {
    const COLORES = ['#1D9E75', '#BA7517', '#888780', '#888780'];
    const bimLabels = ['Bimestre 1', 'Bimestre 2 — Actual', 'Bimestre 3', 'Bimestre 4'];
    const estados = ['Completado', 'En curso', 'Próximamente', 'Próximamente'];

    this.contenido = bimLabels.map((titulo, i) => ({
      titulo,
      estado: estados[i],
      color: COLORES[i],
      semanas: i < 2 ? this.mockSemanas(i) : [],
    }));

    this.bimAbiert = this.contenido.map((_, i) => i < 2);
  }

  private mockSemanas(bim: number): any[] {
    if (bim === 0) return [
      { titulo: 'Semana 01 — Introducción', color: '#1D9E75', chipClass: 'chip-done', chipLabel: 'Completado' },
      { titulo: 'Semana 02 — Conceptos base', color: '#1D9E75', chipClass: 'chip-done', chipLabel: 'Completado' },
      { titulo: 'Semana 03 — Práctica', color: '#1D9E75', chipClass: 'chip-done', chipLabel: 'Completado' },
      { titulo: 'Semana 04 — Evaluación bimestral', color: '#1D9E75', chipClass: 'chip-done', chipLabel: 'Nota: 17' },
    ];
    return [
      { titulo: 'Semana 05 — Tema avanzado', color: '#1D9E75', chipClass: 'chip-done', chipLabel: 'Completado' },
      { titulo: 'Semana 06 — En desarrollo', color: '#BA7517', chipClass: 'chip-pend', chipLabel: 'En curso' },
      { titulo: 'Semana 07 — Próximamente', color: '#888780', chipClass: 'chip-lock', chipLabel: 'Bloqueado' },
    ];
  }

  private cargarMocks(): void {
    // TODO: reemplazar con endpoints reales cuando estén disponibles
    this.tareas = [
      { id: '1', nombre: 'Ejercicios de práctica N° 1', fechaLimite: '2026-06-15', estado: 'PENDIENTE', presencial: false, nota: null },
      { id: '2', nombre: 'Trabajo grupal — Presentación', fechaLimite: '2026-05-30', estado: 'ENTREGADO', presencial: false, nota: 16 },
    ];
    this.evaluaciones = [
      { id: '1', nombre: 'Examen parcial B1', fecha: '2026-04-10', tipo: 'Presencial', estado: 'CALIFICADO', nota: 17 },
      { id: '2', nombre: 'Examen parcial B2', fecha: '2026-06-20', tipo: 'Presencial', estado: 'PENDIENTE', nota: null },
    ];
    this.anuncios = [
      { titulo: 'Cambio de horario — semana 06', cuerpo: 'La clase del lunes 08 de junio se trasladará al martes 09 a las 10:00 am.', fecha: '2026-06-01', fijado: true },
      { titulo: 'Material de estudio disponible', cuerpo: 'Se ha subido el material de la semana 06 en el aula virtual.', fecha: '2026-05-28', fijado: false },
    ];
    this.foro = [
      { autor: 'Ana Torres', iniciales: 'AT', fecha: '2026-06-01', pregunta: '¿Cuándo se publican las notas del examen parcial?', respuesta: 'Las notas estarán disponibles el viernes 05 de junio.' },
      { autor: 'Luis Pérez', iniciales: 'LP', fecha: '2026-05-29', pregunta: '¿El trabajo grupal debe ir en formato PDF o Word?', respuesta: null },
    ];
  }

  // ─── Getters ──────────────────────────────────────────────────────────────

  get pendientes(): any[] {
    return this.tareas.filter(t => t.estado === 'PENDIENTE');
  }

  // ─── Acciones ─────────────────────────────────────────────────────────────

  setTab(key: string): void { this.tabActiva = key; }

  toggleBim(i: number): void { this.bimAbiert[i] = !this.bimAbiert[i]; }

  abrirSemana(sem: any): void {
    if (sem.chipClass === 'chip-lock') {
      this.toastService.show('Esta semana aún no está disponible', 'warn');
      return;
    }
    this.toastService.show('Contenido de ' + sem.titulo, 'info');
  }

  volverACursos(): void { this.router.navigate(['/alumno/mis-cursos']); }

  // ─── Modal Tarea ──────────────────────────────────────────────────────────

  abrirModalTarea(tarea: any): void {
    this.tareaSeleccionada = tarea;
    this.archivoEntrega    = null;
    this.comentarioEntrega = '';
    this.entregaExitosa    = false;
    this.entregando        = false;
    this.modalTareaVisible = true;
  }

  cerrarModalTarea(): void {
    this.modalTareaVisible = false;
    this.tareaSeleccionada = null;
  }

  onArchivoSeleccionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      const file = input.files[0];
      if (file.size > 25 * 1024 * 1024) {
        this.toastService.show('El archivo supera los 25MB', 'error');
        return;
      }
      this.archivoEntrega = file;
    }
  }

  quitarArchivo(): void { this.archivoEntrega = null; }

  enviarTarea(): void {
    if (!this.archivoEntrega || !this.tareaSeleccionada) return;
    this.entregando = true;

    // TODO: conectar con endpoint real cuando exista
    setTimeout(() => {
      this.entregaExitosa = true;
      this.entregando     = false;
      const t = this.tareas.find(x => x.id === this.tareaSeleccionada.id);
      if (t) t.estado = 'ENTREGADO';
      this.toastService.show('¡Tarea enviada correctamente!', 'ok');
    }, 1400);
  }

  get tamanioArchivo(): string {
    if (!this.archivoEntrega) return '';
    const mb = this.archivoEntrega.size / (1024 * 1024);
    return mb < 1
      ? `${(this.archivoEntrega.size / 1024).toFixed(0)} KB`
      : `${mb.toFixed(1)} MB`;
  }

  // ─── Modal Foro ───────────────────────────────────────────────────────────

  abrirModalForo(): void {
    this.preguntaForo    = '';
    this.modalForoVisible = true;
  }

  cerrarModalForo(): void { this.modalForoVisible = false; }

  enviarPregunta(): void {
    if (!this.preguntaForo.trim()) return;
    this.foro.unshift({
      autor: 'Tú',
      iniciales: 'TU',
      fecha: new Date().toLocaleDateString('es-PE'),
      pregunta: this.preguntaForo,
      respuesta: null,
    });
    this.toastService.show('Pregunta publicada', 'ok');
    this.cerrarModalForo();
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  colorNota(nota: number): string {
    if (nota >= 15) return '#1D9E75';
    if (nota >= 11) return '#BA7517';
    return '#A32D2D';
  }
}