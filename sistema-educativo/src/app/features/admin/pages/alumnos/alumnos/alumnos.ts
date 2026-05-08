import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../../../core/services/toast/toast.service';
import { Toast } from '../../../../../core/components/toast/toast/toast'; 
@Component({
  selector: 'app-alumnos',
  standalone: true,
  imports: [CommonModule, FormsModule, Toast],
  templateUrl: './alumnos.html',
  styleUrl: './alumnos.css',
})
export class Alumnos {

  //inyecion de mensajes de toast
  constructor(private toastService: ToastService) {}
  
   showToast(msg: string, type: string = 'info') {
    this.toastService.show(msg, type);
  }
  // Texto de búsqueda
  busqueda: string = '';

  // Array de todos los alumnos
  alumnosCompleto = [
    { id: 1, nombre: 'García Quispe, María Elena', grado: '2° Primaria', estado: 'Activo', matricula: '2025-001' },
    { id: 2, nombre: 'Ramírez Torres, José Luis', grado: '3° Secundaria', estado: 'Activo', matricula: '2025-002' },
    { id: 3, nombre: 'Paredes Vega, Lucía', grado: 'Inicial 4 años', estado: 'Pendiente', matricula: '2025-003' },
    { id: 4, nombre: 'Quispe Tello, Andrés', grado: '5° Primaria', estado: 'Activo', matricula: '2025-004' },
    { id: 5, nombre: 'Morales Díaz, Carmen', grado: 'Inicial 3 años', estado: 'Activo', matricula: '2025-005' },
    { id: 6, nombre: 'Flores Vega, Luis', grado: '1° Primaria', estado: 'Inactivo', matricula: '2025-006' },
  ];

  // Array de alumnos filtrados
  alumnos = this.alumnosCompleto;

  // Método para filtrar alumnos
  filtrarAlumnos() {
    const busquedaLower = this.busqueda.toLowerCase().trim();
    
    if (!busquedaLower) {
      // Si está vacío, mostrar todos
      this.alumnos = this.alumnosCompleto;
    } else {
      // Filtrar por nombre, grado, estado o matrícula
      this.alumnos = this.alumnosCompleto.filter(alumno => 
        alumno.nombre.toLowerCase().includes(busquedaLower) ||
        alumno.grado.toLowerCase().includes(busquedaLower) ||
        alumno.estado.toLowerCase().includes(busquedaLower) ||
        alumno.matricula.toLowerCase().includes(busquedaLower)
      );
    }
  }

  //método para cambiar vista
  cambiarVista(vista: string) {
    const btnTabla = document.getElementById('btnTabla');
    const btnGrid = document.getElementById('btnGrid');
    const tabla = document.getElementById('tablaAlumnos');
    const grid = document.getElementById('gridAlumnos');

    if (vista === 'tabla') {
      btnTabla?.classList.add('active');
      btnGrid?.classList.remove('active');
      tabla?.classList.remove('hidden');
      grid?.classList.add('hidden');
    } else {
      btnTabla?.classList.remove('active');
      btnGrid?.classList.add('active');
      tabla?.classList.add('hidden');
      grid?.classList.remove('hidden');
    }
  }

  // Estado del modal
  modalVisible = false;
  modalTipo: 'nuevo' | 'editar' | 'docs' = 'nuevo';
  alumnoSeleccionado: any = null;

  //método para abrir modal 
  abrirModal(tipo: 'nuevo' | 'editar' | 'docs' = 'nuevo', alumno: any = null) {
    this.modalTipo = tipo;
    this.alumnoSeleccionado = alumno;
    this.modalVisible = true;
    
    // Agregar clase al body para desabilitar scroll
    document.body.classList.add('modal-open');

    // Si es para ver documentos, cambiar a esa pestaña
    if (tipo === 'docs') {
      setTimeout(() => {
        this.switchTab('tDocumentos');
      }, 0);
    }
  }

  // Método para cerrar modal
  cerrarModal() {
    this.modalVisible = false;
    this.alumnoSeleccionado = null;
    
    // Remover clase del body
    document.body.classList.remove('modal-open');
  }

  // Método para guardar cambios
  guardarAlumno() {
    if (this.modalTipo === 'nuevo') {
      // Agregar nuevo alumno
      const nuevoAlumno = {
        id: this.alumnosCompleto.length + 1,
        nombre: this.alumnoSeleccionado?.nombre || '',
        grado: this.alumnoSeleccionado?.grado || '',
        estado: this.alumnoSeleccionado?.estado || 'Activo',
        matricula: this.alumnoSeleccionado?.matricula || ''
      };
      this.alumnosCompleto.push(nuevoAlumno);
    } else if (this.modalTipo === 'editar') {
      // Actualizar alumno existente
      const index = this.alumnosCompleto.findIndex(a => a.id === this.alumnoSeleccionado?.id);
      if (index !== -1) {
        this.alumnosCompleto[index] = this.alumnoSeleccionado;
      }
    }
    
    // Actualizar vista filtrada
    this.filtrarAlumnos();
    this.cerrarModal();
  }
  
  //metodo switchTab para cambiar entre tabs en el modal de edición
  switchTab(panelId: string) {
    // Remover clase active de todos los tabs y paneles
    const mtabs = document.querySelectorAll('.mtab');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    mtabs.forEach(tab => tab.classList.remove('active'));
    tabPanels.forEach(panel => panel.classList.remove('active'));
    
    // Agregar clase active al tab y panel correspondiente
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
   
  // Propiedades para el modal de confirmación
  confirmVisible = false;
  alumnoAEliminar: string = '';

  // Método para eliminar alumno
  confirmarEliminar(nombre: string) {
    this.alumnoAEliminar = nombre;
    this.confirmVisible = true;
  }

  // Método para cerrar modal de confirmación
  cerrarConfirm() {
    this.confirmVisible = false;
    this.alumnoAEliminar = '';
  }

  // Método para ejecutar eliminación
  ejecutarEliminar() {
    if (this.alumnoAEliminar && this.alumnoAEliminar.trim()) {
      // Buscar coincidencia parcial o exacta del nombre
      const index = this.alumnosCompleto.findIndex(a => 
        a.nombre.toLowerCase().includes(this.alumnoAEliminar.toLowerCase()) ||
        this.alumnoAEliminar.toLowerCase().includes(a.nombre.toLowerCase())
      );
      
      if (index !== -1) {
        // Guardar el nombre del alumno eliminado
        const alumnoEliminado = this.alumnosCompleto[index].nombre;
        
        // Eliminar del array completo
        this.alumnosCompleto.splice(index, 1);
        
        // Actualizar la vista filtrada
        this.filtrarAlumnos();
        
        
      }
    }
    
    // Cerrar modal de confirmación siempre
    this.cerrarConfirm();
  }

  // Método para cambiar color de botón al hover (mouseenter)
  onDeleteButtonHover(event: any) {
    const target = event.target as HTMLElement;
    if (target) {
      target.style.background = '#c0392b';
    }
  }

  // Método para restaurar color de botón (mouseleave)
  onDeleteButtonLeave(event: any) {
    const target = event.target as HTMLElement;
    if (target) {
      target.style.background = 'var(--error)';
    }
  }

  //navmes para navegación de meses en reporte de asistencia
  navMes(mes: number) {}

  //metodo stopPropagation() para evitar que se cierre el modal al 
  // hacer click en los botones dentro de la tabla
  stopPropagation(event: any) {
    event.stopPropagation();
  }

  //metodo para exportar datos a Excel (simulado)
  exportar() {
    this.showToast('Función de exportar a Excel no implementada', 'warn');
  }

  //metodo para paginacion 
  paginaActual = 1;
  totalPaginas = 1;
  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      // Aquí iría la lógica para cargar los datos de la página correspondiente
    }
  }
}
