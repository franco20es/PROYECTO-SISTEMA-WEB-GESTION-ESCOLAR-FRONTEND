import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Toast } from '../../../../../core/components/toast/toast/toast';
import { Router } from '@angular/router';
import { ToastService } from '../../../../../core/services/toast/toast.service';
import { Subject, takeUntil } from 'rxjs';
import { Actividad, CursoDetalle, EntregaTarea, Unidad } from '../../../models/curso.model';
import { CursoService } from '../../../service/curso.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-detalle-cursos',
   standalone: true,
  imports: [CommonModule, Toast,FormsModule],
  templateUrl: './detalle-cursos.html',
  styleUrl: './detalle-cursos.css',
})
export class DetalleCursos  implements OnInit, OnDestroy {
 
  private destroy$ = new Subject<void>();
 
  // Estado principal
  curso: CursoDetalle | null = null;
  cargando = true;
  error = '';
 
  // Unidad activa en el sidebar
  unidadActiva: Unidad | null = null;
  indiceActivo = 0;
 
  // Modal entregar tarea
  modalAbierto = false;
  actividadSeleccionada: Actividad | null = null;
  comentarioEntrega = '';
  archivoEntrega: File | null = null;
  entregando = false;
  entregaExitosa = false;
 
  // Toast
  toast = { visible: false, mensaje: '', tipo: 'ok' as 'ok' | 'warn' | 'error' | 'info' };
  private toastTimeout: any;
 
  // Parámetros de ruta
  cursoId = '';
  anio = new Date().getFullYear();
  periodoId = '';
 
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cursoService: CursoService
  ) {}
 
  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.cursoId = params['id'];
    });
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.anio = params['anio'] ? +params['anio'] : this.anio;
      this.periodoId = params['periodoId'] || '';
      this.cargarDetalle();
    });
  }
 
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    clearTimeout(this.toastTimeout);
  }
 
  // ─── Carga de datos ───────────────────────────────────────────────────────
 
  cargarDetalle(): void {
    this.cargando = true;
    this.cursoService
      .getDetalleCurso(this.cursoId, this.anio, this.periodoId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.curso = data;
          // Activar la unidad en curso por defecto
          const idx = data.unidades.findIndex(u => u.estado === 'en_curso');
          this.seleccionarUnidad(idx >= 0 ? idx : 0);
          this.cargando = false;
        },
        error: (err) => {
          this.error = 'No se pudo cargar el curso. Intenta de nuevo.';
          this.cargando = false;
          this.mostrarToast('Error al cargar el curso', 'error');
        }
      });
  }
 
  // ─── Navegación ───────────────────────────────────────────────────────────
 
  seleccionarUnidad(idx: number): void {
    if (!this.curso) return;
    const unidad = this.curso.unidades[idx];
    if (unidad.estado === 'bloqueada') {
      this.mostrarToast('Esta unidad aún no está disponible', 'warn');
      return;
    }
    this.indiceActivo = idx;
    this.unidadActiva = unidad;
  }
 
  volverACursos(): void {
    this.router.navigate(['/alumno/mis-cursos']);
  }
 
  // ─── Modal entregar tarea ─────────────────────────────────────────────────
 
  abrirModal(actividad: Actividad): void {
    if (actividad.estado !== 'pendiente') return;
    this.actividadSeleccionada = actividad;
    this.comentarioEntrega = '';
    this.archivoEntrega = null;
    this.entregaExitosa = false;
    this.entregando = false;
    this.modalAbierto = true;
  }
 
  cerrarModal(): void {
    this.modalAbierto = false;
    this.actividadSeleccionada = null;
  }
 
  onArchivoSeleccionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const archivo = input.files[0];
      if (archivo.size > 25 * 1024 * 1024) {
        this.mostrarToast('El archivo supera el límite de 25MB', 'warn');
        return;
      }
      this.archivoEntrega = archivo;
    }
  }
 
  quitarArchivo(): void {
    this.archivoEntrega = null;
  }
 
  enviarTarea(): void {
    if (!this.archivoEntrega) {
      this.mostrarToast('Selecciona un archivo para enviar', 'warn');
      return;
    }
    if (!this.actividadSeleccionada) return;
 
    this.entregando = true;
    const entrega: EntregaTarea = {
      actividadId: this.actividadSeleccionada.id,
      comentario: this.comentarioEntrega,
      archivo: this.archivoEntrega
    };
 
    this.cursoService.entregarTarea(this.actividadSeleccionada.id, entrega)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.entregaExitosa = true;
          this.entregando = false;
          // Actualizar estado local
          if (this.actividadSeleccionada && this.unidadActiva) {
            const act = this.unidadActiva.actividades
              .find(a => a.id === this.actividadSeleccionada!.id);
            if (act) act.estado = 'entregada';
          }
          this.mostrarToast('¡Tarea enviada correctamente!', 'ok');
        },
        error: () => {
          this.entregando = false;
          this.mostrarToast('Error al enviar la tarea. Intenta de nuevo.', 'error');
        }
      });
  }
 
  // ─── Toast ────────────────────────────────────────────────────────────────
 
  mostrarToast(mensaje: string, tipo: 'ok' | 'warn' | 'error' | 'info' = 'ok'): void {
    clearTimeout(this.toastTimeout);
    this.toast = { visible: true, mensaje, tipo };
    this.toastTimeout = setTimeout(() => {
      this.toast.visible = false;
    }, 3200);
  }
 
  // ─── Helpers ──────────────────────────────────────────────────────────────
 
  get pendientesTotales(): Actividad[] {
    if (!this.curso) return [];
    return this.curso.unidades.flatMap(u =>
      u.actividades.filter(a => a.estado === 'pendiente')
    );
  }
 
  colorNota(nota: number | null): string {
    if (nota === null) return '#8A95B0';
    if (nota >= 15) return '#00C27C';
    if (nota >= 11) return '#F5A623';
    return '#E53030';
  }
 
  trackByUnidad(index: number, unidad: Unidad): string {
    return unidad.id;
  }
 
  trackByActividad(index: number, actividad: Actividad): string {
    return actividad.id;
  }
 
  get tamanioArchivo(): string {
    if (!this.archivoEntrega) return '';
    const mb = this.archivoEntrega.size / (1024 * 1024);
    return mb < 1
      ? `${(this.archivoEntrega.size / 1024).toFixed(0)} KB`
      : `${mb.toFixed(1)} MB`;
  }
}
