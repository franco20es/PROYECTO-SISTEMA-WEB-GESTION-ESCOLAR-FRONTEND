import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Toast } from '../../../../../core/components/toast/toast/toast';
import { ToastService } from '../../../../../core/services/toast/toast.service';

@Component({
  selector: 'app-cursos',
  imports: [CommonModule, Toast],
  templateUrl: './cursos.html',
  styleUrl: './cursos.css',
})
export class CursosComponent {
 
 constructor(private toastService: ToastService) {}

  showToast(msg: string, type: string = 'info') {
    this.toastService.show(msg, type);
  }


  //metodo para abrir modal de nuevo curso 
  abrirModalNuevoCurso = false;
  abrirModalNuevo(){
    this.abrirModalNuevoCurso = true;
  }

  cerrarModalNuevo(){
    this.abrirModalNuevoCurso = false;
  }

  //metodo para abrir modal editar curso
  abrirModalEditarCurso = false;

  cerrarModalEditar(){
    this.abrirModalEditarCurso = false;
  }

  //metodo para abrir modal asignar docente
  abrirModalAsignarDocente = false;
  abrirModalAsignar(){
    this.abrirModalAsignarDocente = true;
  }

  cerrarModalAsignar(){
    this.abrirModalAsignarDocente = false;
  }

  //metodo para abrir modal horario
  abrirModalHorario = false;
  abrirModalHor(){
    this.abrirModalHorario = true;
  }

  cerrarModalHor(){
    this.abrirModalHorario = false;
  }

  guardarCurso() {
    this.showToast('Curso guardado correctamente', 'success');
    this.cerrarModalNuevo();
  }

  confirmarAsignacion() {
    this.showToast('Docente asignado correctamente', 'success');
    this.cerrarModalAsignar();
  }

  guardarHorario() {
    this.showToast('Horario guardado correctamente', 'success');
    this.cerrarModalHor();
  }

  // Panel detalle de curso
  mostrarPanelDetalle = false;
  cerrarDetalle() {
    this.mostrarPanelDetalle = false;
  }

  //funcion para cambiar de pestaña 
  tabActivo: string = 'tabCursos';
  cambiarTab(tabId: string){
    this.tabActivo = tabId;
  }

 //funcion para cambiar de nivel
nivelActivo: string = 'all';
filtrarNivel(nivel: string) {
  this.nivelActivo = nivel;
}
//funcion para cambiar vista
vista: string = 'grid';

cambiarVista(vista: string) {
  this.vista = vista;
}
cursoSeleccionado: any = null;
verDetalle(id: string, nombre: string, nivel: string, codigo: string, docente: string, initials: string, alumnos: number, horas: number, estado: string) {
  this.cursoSeleccionado = { id, nombre, nivel, codigo, docente, initials, alumnos, horas, estado };
  this.mostrarPanelDetalle = true;
}

abrirModalEditar(id: string, nombre: string, nivel: string, grado: string, docente: string, horas: number) {
  this.abrirModalEditarCurso = true;
}

pdTab(btn: any, panelId: string) {
  const tabs = document.querySelectorAll('.pd-tab');
  tabs.forEach(t => t.classList.remove('active'));
  (btn.target || btn).classList.add('active');
  const panels = document.querySelectorAll('.pd-panel');
  panels.forEach(p => p.classList.remove('active'));
  const panel = document.getElementById(panelId);
  if (panel) panel.classList.add('active');
}

//eliminar curso

cursoAEliminar: any = null;
eliminarCurso(curso: any) {
  console.log('Eliminar:', curso);
}

//funcion para biscvar cursos
buscarCurso(termino: string) {
  console.log('Buscar:', termino);
}
}
