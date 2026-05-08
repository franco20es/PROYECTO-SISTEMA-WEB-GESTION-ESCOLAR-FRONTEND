import { Component } from '@angular/core';
import { Toast } from '../../../../../core/components/toast/toast/toast';
import { ToastService } from '../../../../../core/services/toast/toast.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, Toast],
  templateUrl: './configuracion.html',
  styleUrl: './configuracion.css',
})
export class Configuracion {

  constructor( private toastService: ToastService) {}

  showToast(msg: string, type: string = 'info') {
    this.toastService.show(msg, type);
  }


  //configuracion de setpanel
  //definir variable para panel activo
  panelActivo: string = 'pInst';
  setPanel(panelId: string) {
    // Si el panel ya está activo, no hacer nada
    this.panelActivo = panelId;
  }

  //metodo para abrir modal de seccion

  abrirModalUsuario = false;
  abrirModalSeccion = false;
  
  abrirModal(modalId: string){
    if (modalId === 'modalUsuario') {
      this.abrirModalUsuario = true;
    } else if (modalId === 'modalSeccion') {
      this.abrirModalSeccion = true;
    }
  }

  //metodo para cerrar modal
  cerrarModal(modalId: string) {
    if (modalId === 'modalUsuario') {
      this.abrirModalUsuario = false;
    } else if (modalId === 'modalSeccion') {
      this.abrirModalSeccion = false;
    }
  }

  //metodo para toggleNcChk
  toggleNcChk(event: any) {
    const element = event.currentTarget as HTMLElement;
    element.classList.toggle('on');
  }

  //metodos para guardar
  guardarUsuario() {
    this.cerrarModal('modalUsuario');
    this.showToast('Usuario creado correctamente', 'success');
  }

  guardarSeccion() {
    this.cerrarModal('modalSeccion');
    this.showToast('Sección creada correctamente', 'success');
  }
}
