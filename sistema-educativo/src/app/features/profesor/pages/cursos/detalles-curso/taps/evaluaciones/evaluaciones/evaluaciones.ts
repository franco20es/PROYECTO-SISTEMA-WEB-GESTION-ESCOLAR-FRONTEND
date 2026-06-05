// evaluaciones-docente.ts
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { EvaluacionDocenteService } from '../../../../../../services/evaluacion.service'; 
import { ToastService } from '../../../../../../../../core/services/toast/toast.service';

@Component({
  selector: 'app-evaluaciones-docente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './evaluaciones.html',
  styleUrl: './evaluaciones.css',
})
export class EvaluacionesDocente implements OnInit {

  @Input() cursoId!: string;
  @Input() seccionId!: string;

  private evalService = inject(EvaluacionDocenteService);
  private toast       = inject(ToastService);

  anio = new Date().getFullYear();
  docenteId = localStorage.getItem('docenteId') || '';

  cargandoPeriodos = signal(true);
  periodos = signal<any[]>([]);
  periodoSel = signal<string>('');

  cargando = signal(false);
  componentes = signal<any[]>([]);
  sumaPesos = signal(0);

  // Examenes
  examenes = signal<any[]>([]);

  // Modal crear componente
  modalComp = signal(false);
  formComp = { nombre: '', descripcion: '', peso: 20, orden: 1 };
  guardandoComp = signal(false);

  // Modal calificar
  modalNotas = signal(false);
  compActivo: any = null;
  alumnos = signal<any[]>([]);
  cargandoNotas = signal(false);

  // Modal crear examen
  modalExamen = signal(false);
  guardandoExamen = signal(false);
  formExamen: any = {
    titulo: '', descripcion: '', duracionMinutos: 30, fechaLimite: '', componenteId: '',
    preguntas: []
  };

 ngOnInit(): void {
  // Si no llegó el seccionId por @Input, sácalo del sessionStorage
  if (!this.seccionId) {
    const data = sessionStorage.getItem('cursosDocente');
    if (data) {
      const cursos = JSON.parse(data);
      const curso = cursos.find((c: any) => c.id === this.cursoId);
      if (curso) this.seccionId = curso.seccionId || '';
    }
  }
  this.cargarPeriodos();
  this.cargarExamenes();
}

  cargarPeriodos(): void {
    this.cargandoPeriodos.set(true);
    this.evalService.getPeriodos(this.anio).subscribe({
      next: (data) => {
        this.periodos.set(data || []);
        this.cargandoPeriodos.set(false);
        if (data?.length) {
          this.periodoSel.set(data[0].id);
          this.cargarComponentes();
        }
      },
      error: () => { this.periodos.set([]); this.cargandoPeriodos.set(false); }
    });
  }

  onCambiarPeriodo(id: string): void {
    this.periodoSel.set(id);
    this.cargarComponentes();
  }

  cargarComponentes(): void {
    if (!this.periodoSel()) return;
    this.cargando.set(true);
    forkJoin({
      comps: this.evalService.listarComponentes(this.cursoId, this.periodoSel()),
      suma: this.evalService.sumaPesos(this.cursoId, this.periodoSel())
    }).subscribe({
      next: ({ comps, suma }) => {
        this.componentes.set(comps || []);
        this.sumaPesos.set(suma || 0);
        this.cargando.set(false);
      },
      error: () => { this.componentes.set([]); this.cargando.set(false); }
    });
  }

  cargarExamenes(): void {
    this.evalService.listarExamenes(this.cursoId).subscribe({
      next: (data) => this.examenes.set(data || []),
      error: () => this.examenes.set([])
    });
  }

  // ── Crear componente ──
  abrirModalComp(): void {
    const disponible = 100 - this.sumaPesos();
    this.formComp = { nombre: '', descripcion: '', peso: disponible > 0 ? Math.min(20, disponible) : 0, orden: this.componentes().length + 1 };
    this.modalComp.set(true);
  }

  crearComponente(): void {
    if (!this.formComp.nombre.trim()) { this.toast.show('Escribe el nombre', 'warn'); return; }
    if (this.formComp.peso <= 0) { this.toast.show('El peso debe ser mayor a 0', 'warn'); return; }
    if (this.sumaPesos() + this.formComp.peso > 100) {
      this.toast.show(`Excede 100%. Disponible: ${100 - this.sumaPesos()}%`, 'warn'); return;
    }
    this.guardandoComp.set(true);
    this.evalService.crearComponente({
      cursoId: this.cursoId, periodoId: this.periodoSel(),
      nombre: this.formComp.nombre.trim(), descripcion: this.formComp.descripcion.trim(),
      peso: this.formComp.peso, orden: this.formComp.orden
    }).subscribe({
      next: () => { this.cargarComponentes(); this.guardandoComp.set(false); this.modalComp.set(false); this.toast.show('Componente creado', 'ok'); },
      error: (err) => { this.guardandoComp.set(false); this.toast.show(err.error?.message || 'Error', 'error'); }
    });
  }

  eliminarComponente(comp: any, event: Event): void {
    event.stopPropagation();
    if (!confirm(`¿Eliminar "${comp.nombre}"?`)) return;
    this.evalService.eliminarComponente(comp.id).subscribe({
      next: () => { this.cargarComponentes(); this.toast.show('Eliminado', 'info'); },
      error: (err) => { this.toast.show(err.error?.message || 'No se puede (tiene notas)', 'error'); }
    });
  }

  // ── Calificar ──
  abrirCalificar(comp: any): void {
    this.compActivo = comp;
    this.modalNotas.set(true);
    this.cargandoNotas.set(true);
    this.alumnos.set([]);
    forkJoin({
      matriculas: this.evalService.alumnosSeccion(this.seccionId),
      notas: this.evalService.notasComponente(comp.id)
    }).subscribe({
      next: ({ matriculas, notas }) => {
        const lista = (matriculas?.content || []).map((m: any) => {
          const ne = (notas || []).find((n: any) => n.matriculaId === m.id);
          return {
            matriculaId: m.id, nombre: m.alumnoNombreCompleto, dni: m.alumnoDni,
            nota: ne ? ne.calificacion : null, notaId: ne ? ne.id : null, observacion: ne ? ne.observacion : ''
          };
        });
        this.alumnos.set(lista);
        this.cargandoNotas.set(false);
      },
      error: () => { this.alumnos.set([]); this.cargandoNotas.set(false); }
    });
  }

  guardarNota(alumno: any): void {
    if (alumno.nota == null || alumno.nota === '') { this.toast.show('Ingresa una nota', 'warn'); return; }
    const nota = parseFloat(alumno.nota);
    if (nota < 0 || nota > 20) { this.toast.show('Nota entre 0 y 20', 'warn'); return; }
    const body = { matriculaId: alumno.matriculaId, componenteId: this.compActivo.id, docenteId: this.docenteId, calificacion: nota, observacion: alumno.observacion || '' };
    const obs = alumno.notaId ? this.evalService.actualizarNota(alumno.notaId, body) : this.evalService.registrarNota(body);
    obs.subscribe({
      next: (res) => { alumno.notaId = res.id; this.toast.show(`Nota de ${alumno.nombre} guardada`, 'ok'); },
      error: (err) => { this.toast.show(err.error?.message || 'Error', 'error'); }
    });
  }

  cerrarNotas(): void { this.modalNotas.set(false); this.cargarComponentes(); }

  get pesoColor(): string {
    const s = this.sumaPesos();
    if (s === 100) return '#1D9E75';
    if (s > 100) return '#E53030';
    return '#BA7517';
  }

  // ══════════ EXÁMENES EN LÍNEA ══════════

  abrirModalExamen(): void {
    if (this.componentes().length === 0) {
      this.toast.show('Primero crea al menos un componente', 'warn');
      return;
    }
    this.formExamen = {
      titulo: '', descripcion: '', duracionMinutos: 30, fechaLimite: '',
      componenteId: this.componentes()[0].id,
      preguntas: [ this.nuevaPregunta() ]
    };
    this.modalExamen.set(true);
  }

  nuevaPregunta(): any {
    return {
      enunciado: '', puntaje: 1,
      alternativas: [
        { texto: '', esCorrecta: true },
        { texto: '', esCorrecta: false }
      ]
    };
  }

  agregarPregunta(): void {
    this.formExamen.preguntas.push(this.nuevaPregunta());
  }

  eliminarPregunta(i: number): void {
    if (this.formExamen.preguntas.length <= 1) {
      this.toast.show('Debe haber al menos una pregunta', 'warn');
      return;
    }
    this.formExamen.preguntas.splice(i, 1);
  }

  agregarAlternativa(preg: any): void {
    if (preg.alternativas.length >= 5) {
      this.toast.show('Máximo 5 alternativas', 'warn');
      return;
    }
    preg.alternativas.push({ texto: '', esCorrecta: false });
  }

  eliminarAlternativa(preg: any, j: number): void {
    if (preg.alternativas.length <= 2) {
      this.toast.show('Mínimo 2 alternativas', 'warn');
      return;
    }
    // Si elimino la correcta, marco la primera
    const eraCorrecta = preg.alternativas[j].esCorrecta;
    preg.alternativas.splice(j, 1);
    if (eraCorrecta) preg.alternativas[0].esCorrecta = true;
  }

  marcarCorrecta(preg: any, j: number): void {
    preg.alternativas.forEach((a: any, idx: number) => a.esCorrecta = idx === j);
  }

  validarExamen(): string | null {
    const f = this.formExamen;
    if (!f.titulo.trim()) return 'Escribe el título del examen';
    if (!f.componenteId) return 'Selecciona el componente';
    if (!f.fechaLimite) return 'Indica la fecha límite';
    if (!f.preguntas.length) return 'Agrega al menos una pregunta';
    for (let i = 0; i < f.preguntas.length; i++) {
      const p = f.preguntas[i];
      if (!p.enunciado.trim()) return `La pregunta ${i + 1} no tiene enunciado`;
      if (p.alternativas.some((a: any) => !a.texto.trim())) return `La pregunta ${i + 1} tiene alternativas vacías`;
      if (!p.alternativas.some((a: any) => a.esCorrecta)) return `La pregunta ${i + 1} no tiene respuesta correcta`;
    }
    return null;
  }

  crearExamen(publicar: boolean): void {
    const error = this.validarExamen();
    if (error) { this.toast.show(error, 'warn'); return; }

    this.guardandoExamen.set(true);
    const f = this.formExamen;
    const body = {
      cursoId: this.cursoId,
      componenteId: f.componenteId,
      docenteId: this.docenteId,
      titulo: f.titulo.trim(),
      descripcion: f.descripcion.trim(),
      duracionMinutos: f.duracionMinutos,
      fechaLimite: f.fechaLimite + 'T23:59:00',
      preguntas: f.preguntas.map((p: any, i: number) => ({
        enunciado: p.enunciado.trim(),
        orden: i + 1,
        puntaje: p.puntaje,
        alternativas: p.alternativas.map((a: any) => ({ texto: a.texto.trim(), esCorrecta: a.esCorrecta }))
      }))
    };

    this.evalService.crearExamen(body).subscribe({
      next: (res) => {
        const examenId = res.examenId || res.id;
        if (publicar && examenId) {
          this.evalService.publicarExamen(examenId).subscribe({
            next: () => { this.finExamen('Examen creado y publicado'); },
            error: () => { this.finExamen('Examen creado (no se pudo publicar)'); }
          });
        } else {
          this.finExamen('Examen creado (borrador)');
        }
      },
      error: (err) => {
        this.guardandoExamen.set(false);
        this.toast.show(err.error?.message || 'Error al crear el examen', 'error');
      }
    });
  }

  private finExamen(msg: string): void {
    this.guardandoExamen.set(false);
    this.modalExamen.set(false);
    this.cargarExamenes();
    this.toast.show(msg, 'ok');
  }

  publicarExamen(examen: any, event: Event): void {
    event.stopPropagation();
    this.evalService.publicarExamen(examen.id).subscribe({
      next: () => { this.cargarExamenes(); this.toast.show('Examen publicado', 'ok'); },
      error: () => { this.toast.show('Error al publicar', 'error'); }
    });
  }

  eliminarExamen(examen: any, event: Event): void {
    event.stopPropagation();
    if (!confirm(`¿Eliminar el examen "${examen.titulo}"?`)) return;
    this.evalService.eliminarExamen(examen.id).subscribe({
      next: () => { this.examenes.set(this.examenes().filter(e => e.id !== examen.id)); this.toast.show('Examen eliminado', 'info'); },
      error: () => { this.toast.show('Error al eliminar', 'error'); }
    });
  }

  nombreComponente(id: string): string {
    const c = this.componentes().find(c => c.id === id);
    return c ? c.nombre : '';
  }
}