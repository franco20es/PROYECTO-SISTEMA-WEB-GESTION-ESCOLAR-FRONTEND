import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../../../core/services/toast/toast.service';
import { Toast } from '../../../../../core/components/toast/toast/toast';
import { AlumnoService } from '../../../service/alumno.service';

@Component({
  selector: 'app-alumnos',
  standalone: true,
  imports: [CommonModule, FormsModule, Toast],
  templateUrl: './alumnos.html',
  styleUrl: './alumnos.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Alumnos implements OnInit {

  alumnos: any[] = [];
  busqueda: string = '';
  vistaActual: 'tabla' | 'grid' = 'tabla';

  modalVisible = false;
  modalTipo: 'nuevo' | 'editar' | 'docs' = 'nuevo';
  alumnoSeleccionado: any = null;

  confirmVisible = false;
  alumnoAEliminar: any = null;

  paginaActual = 0;
  totalPaginas = 0;
  totalElementos = 0;
  tamanoPagina = 10;

  loading = false;

  filtroEstado: string = '';



  constructor(
    private toastService: ToastService,
    private alumnoService: AlumnoService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  Promise.resolve().then(() => {
    this.cargarKpis();
    this.cargarAlumnos();
  });
}

  showToast(msg: string, type: string = 'info') {
    this.toastService.show(msg, type);
  }


  // Cuando el usuario clickea "Activos", "Retirados", etc:
  aplicarFiltroEstado(estado: string): void {
    this.filtroEstado = estado;
    this.cargarAlumnos(0);
  }

  // En alumnos.ts — reemplaza cargarAlumnos()
  cargarAlumnos(pagina = 0): void {
  this.alumnoService.listarConMatricula(
    this.filtroEstado || undefined,
    this.busqueda || undefined,
    new Date().getFullYear(),
    pagina,
    this.tamanoPagina
  ).subscribe({
    next: (res) => {
      this.alumnos = res.content;
      this.totalPaginas = res.totalPages;
      this.totalElementos = res.totalElements;
      this.paginaActual = res.number;
      this.cdr.markForCheck(); // ← markForCheck en vez de detectChanges
    },
    error: () => this.showToast('Error al cargar alumnos', 'error')
  });
}

  filtrarAlumnos() {
    this.cargarAlumnos(0);
  }

  cambiarVista(vista: 'tabla' | 'grid') {
    this.vistaActual = vista;
  }

  abrirModal(tipo: 'nuevo' | 'editar' | 'docs' = 'nuevo', alumno: any = null) {
    this.modalTipo = tipo;
    this.modalVisible = true;
    document.body.classList.add('modal-open');

    if (tipo === 'nuevo') {
      this.alumnoSeleccionado = {
        id: null,
        nombres: '',
        apellidos: '',
        dni: '',
        nombreApoderado: '',
        telefonoApoderado: '',
        emailApoderado: '',
        estado: 'ACTIVO'
      };
    } else {
      this.alumnoSeleccionado = { ...alumno };
    }

    if (tipo === 'docs') {
      setTimeout(() => {
        this.switchTab('tDocumentos');
      }, 0);
    }
  }


  kpis = { total: 0, inicial: 0, primaria: 0, secundaria: 0, nuevos: 0 };



  cargarKpis(): void {
    this.alumnoService.obtenerKpis(new Date().getFullYear()).subscribe({
      next: (data) => {this.kpis = data;
      this.cdr.detectChanges();
      },
      error: () => this.showToast('Error al cargar KPIs', 'error')
    });
  }


  // ESTE ES EL MÉTODO QUE FALTA EN TU ARCHIVO TS
  obtenerArregloPaginas(): number[] {
    const total = this.totalPaginas;
    const current = this.paginaActual;

    const maxVisible = 5;
    const half = Math.floor(maxVisible / 2);

    let start = Math.max(0, current - half);
    let end = Math.min(total - 1, current + half);

    if (current <= half) {
      end = Math.min(total - 1, maxVisible - 1);
    }

    if (current >= total - half - 1) {
      start = Math.max(0, total - maxVisible);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }



  cerrarModal() {
    this.modalVisible = false;
    this.alumnoSeleccionado = null;
    document.body.classList.remove('modal-open');
  }

  guardarAlumno() {
    if (!this.alumnoSeleccionado.nombres || !this.alumnoSeleccionado.apellidos) {
      this.showToast('Por favor, complete los campos obligatorios', 'warn');
      return;
    }

    if (this.modalTipo === 'nuevo') {
      this.showToast('Funcionalidad de crear no mapeada en el componente', 'info');
    } else if (this.modalTipo === 'editar') {
      this.alumnoService.actualizarAlumno(this.alumnoSeleccionado.id, this.alumnoSeleccionado).subscribe({
        next: () => {
          this.showToast('Alumno actualizado correctamente', 'success');
          this.cargarAlumnos(this.paginaActual);
          this.cerrarModal();
        },
        error: (err) => this.showToast('Error al actualizar el alumno', 'error')
      });
    }
  }

  switchTab(panelId: string) {
    const mtabs = document.querySelectorAll('.mtab');
    const tabPanels = document.querySelectorAll('.tab-panel');

    mtabs.forEach(tab => tab.classList.remove('active'));
    tabPanels.forEach(panel => panel.classList.remove('active'));

    const activeTab = Array.from(mtabs).find(tab =>
      tab.textContent?.toLowerCase().includes(panelId.replace('t', '').toLowerCase()) ||
      tab.getAttribute('data-tab') === panelId
    );

    if (activeTab) {
      activeTab.classList.add('active');
    }

    const activePanel = document.getElementById(panelId);
    if (activePanel) {
      activePanel.classList.add('active');
    }
  }

  confirmarEliminar(alumno: any) {
    this.alumnoAEliminar = alumno;
    this.confirmVisible = true;
  }

  cerrarConfirm() {
    this.confirmVisible = false;
    this.alumnoAEliminar = null;
  }

  ejecutarEliminar() {
    if (this.alumnoAEliminar && this.alumnoAEliminar.id) {
      this.alumnoService.eliminarAlumno(this.alumnoAEliminar.id).subscribe({
        next: () => {
          this.showToast('Alumno desactivado correctamente', 'success');
          this.cargarAlumnos(this.paginaActual);
          this.cerrarConfirm();
        },
        error: (err) => this.showToast('Error al desactivar el alumno', 'error')
      });
    }
  }

  obtenerIniciales(nombres: string, apellidos: string): string {
    if (!nombres || !apellidos) return 'AA';
    return `${nombres.charAt(0)}${apellidos.charAt(0)}`.toUpperCase();
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 0 && pagina < this.totalPaginas) {
      this.cargarAlumnos(pagina);
    }
  }

  // En alumnos.ts
  exportar(): void {
    this.alumnoService.exportarExcel().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Reporte_Alumnos_${new Date().getFullYear()}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.showToast('Reporte descargado correctamente', 'success');
      },
      error: () => this.showToast('Error al exportar el reporte', 'error')
    });
  }

  navMes(mes: number) { }
}