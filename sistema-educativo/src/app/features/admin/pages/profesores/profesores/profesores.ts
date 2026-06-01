// docentes.ts
import { Component, OnInit, ChangeDetectorRef, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocenteService } from '../../../service/profesor.service'; 
import { ToastService } from '../../../../../core/services/toast/toast.service';
import { Toast } from '../../../../../core/components/toast/toast/toast';

@Component({
  selector: 'app-profesores',
  standalone: true,
  imports: [CommonModule, FormsModule, Toast],
  templateUrl: './profesores.html',
  styleUrl: './profesores.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Profesores implements OnInit {

  private docenteService = inject(DocenteService);
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  // ─── Lista ────────────────────────────────────────────────────────────────
  docentes: any[] = [];
  loading = false;

  // ─── Filtros ──────────────────────────────────────────────────────────────
  busqueda = '';
  filtroEstado = '';
  filtroContrato = '';
  vistaActual: 'tabla' | 'grid' = 'tabla';

  // ─── Paginación ───────────────────────────────────────────────────────────
  paginaActual = 0;
  totalPaginas = 0;
  totalElementos = 0;
  tamanoPagina = 10;

  // ─── Modal ────────────────────────────────────────────────────────────────
  modalVisible = false;
  modalTipo: 'nuevo' | 'editar' | 'horario' | 'ver' = 'nuevo';
  docenteSeleccionado: any = null;
  tabActiva = 'tabDatos';

  // ─── Confirm ──────────────────────────────────────────────────────────────
  confirmVisible = false;
  docenteAEliminar: any = null;

  ngOnInit(): void {
    Promise.resolve().then(() => this.cargarDocentes());
  }

  // ─── Carga ────────────────────────────────────────────────────────────────
  cargarDocentes(pagina = 0): void {
    this.loading = true;
    this.docenteService.listarConFiltros(
      this.filtroEstado || undefined,
      this.busqueda || undefined,
      pagina,
      this.tamanoPagina
    ).subscribe({
      next: (res) => {
        this.docentes = res.content;
        this.totalPaginas = res.totalPages;
        this.totalElementos = res.totalElements;
        this.paginaActual = res.number;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.showToast('Error al cargar docentes', 'error');
        this.loading = false;
      }
    });
  }

  buscar(valor: string): void {
    this.busqueda = valor;
    this.cargarDocentes(0);
  }

  filtrar(btn?: any): void {
    if (btn) {
      document.querySelectorAll('.ftab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.getAttribute('data-f');
      this.filtroEstado = f === 'all' ? '' : f.toUpperCase();
    }
    this.cargarDocentes(0);
  }

  cambiarVista(vista: 'tabla' | 'grid'): void {
    this.vistaActual = vista;
  }

  cambiarPagina(p: number): void {
    if (p >= 0 && p < this.totalPaginas) this.cargarDocentes(p);
  }

  confirmarDesactivar(docente: any): void {
    this.docenteAEliminar = docente;
    this.confirmVisible = true;
  }

 
  // ─── Modal ────────────────────────────────────────────────────────────────
  abrirModal(tipo: 'nuevo' | 'editar' | 'horario', docente?: any): void {
    this.modalTipo = tipo;
    this.tabActiva = 'tabDatos';
   

    if (tipo === 'nuevo') {
      this.docenteSeleccionado = {
        nombres: '', apellidos: '', dni: '',
        email: '', telefono: '', direccion: '',
        especialidad: '', tituloProfesional: '',
        estadoContrato: 'CONTRATADO', genero: 'MASCULINO'
      };
    } else {
      this.docenteSeleccionado = { ...docente };
    }

    this.modalVisible = true;
    document.body.classList.add('modal-open');
  }

  cerrarModal(): void {
    this.modalVisible = false;
    this.docenteSeleccionado = null;
    document.body.classList.remove('modal-open');
  }

 switchTab(tabId: string): void {
  this.tabActiva = tabId;
}

  guardarProfesor(): void {
  if (!this.docenteSeleccionado) return;

  // Validaciones básicas
  if (!this.docenteSeleccionado.nombres || 
      !this.docenteSeleccionado.apellidos || 
      !this.docenteSeleccionado.dni ||
      !this.docenteSeleccionado.especialidad ||
      !this.docenteSeleccionado.estadoContrato) {
    this.showToast('Completa los campos obligatorios', 'warn');
    return;
  }

  const payload = {
    dni:               this.docenteSeleccionado.dni,
    nombres:           this.docenteSeleccionado.nombres,
    apellidos:         this.docenteSeleccionado.apellidos,
    fechaNacimiento:   this.docenteSeleccionado.fechaNacimiento,
    genero:            this.docenteSeleccionado.genero || 'MASCULINO',
    especialidad:      this.docenteSeleccionado.especialidad,
    tituloProfesional: this.docenteSeleccionado.tituloProfesional,
    telefono:          this.docenteSeleccionado.telefono,
    email:             this.docenteSeleccionado.email,
    direccion:         this.docenteSeleccionado.direccion,
    estadoContrato:    this.docenteSeleccionado.estadoContrato
  };

  if (this.modalTipo === 'nuevo') {
    this.docenteService.crear(payload).subscribe({  // ← POST
      next: () => {
        this.showToast('Docente creado correctamente', 'success');
        this.cargarDocentes(0);
        this.cerrarModal();
      },
      error: (err) => this.showToast(err.error?.message || 'Error al crear', 'error')
    });
  } else {
    this.docenteService.actualizar(this.docenteSeleccionado.id, payload).subscribe({  // ← PUT
      next: () => {
        this.showToast('Docente actualizado correctamente', 'success');
        this.cargarDocentes(this.paginaActual);
        this.cerrarModal();
      },
      error: (err) => this.showToast(err.error?.message || 'Error al actualizar', 'error')
    });
  }
}

  // ─── Acciones ─────────────────────────────────────────────────────────────
  confirmarEliminar(docente: any): void {
    this.docenteAEliminar = docente;
    this.confirmVisible = true;
  }

  cerrarConfirm(): void {
    this.confirmVisible = false;
    this.docenteAEliminar = null;
  }

  ejecutarEliminar(): void {
    if (!this.docenteAEliminar) return;
    this.docenteService.desactivar(this.docenteAEliminar.id).subscribe({
      next: () => {
        this.showToast('Docente desactivado correctamente', 'success');
        this.cargarDocentes(this.paginaActual);
        this.cerrarConfirm();
      },
      error: (err) => this.showToast(err.error?.message || 'Error al desactivar', 'error')
    });
  }

  ponerEnLicencia(docente: any): void {
    this.docenteService.ponerEnLicencia(docente.id).subscribe({
      next: () => {
        this.showToast('Docente puesto en licencia', 'success');
        this.cargarDocentes(this.paginaActual);
      },
      error: () => this.showToast('Error al cambiar estado', 'error')
    });
  }

  exportar(): void {
    this.docenteService.exportarExcel().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Reporte_Docentes_${new Date().getFullYear()}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.showToast('Reporte descargado', 'success');
      },
      error: () => this.showToast('Error al exportar', 'error')
    });
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────
  obtenerIniciales(nombres: string, apellidos: string): string {
    if (!nombres || !apellidos) return 'DO';
    return `${nombres.charAt(0)}${apellidos.charAt(0)}`.toUpperCase();
  }

  obtenerArregloPaginas(): number[] {
    const total = this.totalPaginas;
    const current = this.paginaActual;
    const maxVisible = 5;
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(0, current - half);
    let end = Math.min(total - 1, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(0, end - maxVisible + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  showToast(msg: string, type = 'info'): void {
    this.toastService.show(msg, type);
  }

    toggleHorario(boton: any): void {
    console.log('click horario');
  }

  toggleChk(event: any): void {

  const elemento = event.currentTarget || event;

  elemento.classList.toggle('active');

}
}