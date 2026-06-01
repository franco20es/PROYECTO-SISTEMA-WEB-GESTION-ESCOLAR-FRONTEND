import { Component } from '@angular/core';
import { Toast } from '../../../../../core/components/toast/toast/toast';
import { ToastService } from '../../../../../core/services/toast/toast.service';
@Component({
  selector: 'app-finanzas',
  standalone: true,
  imports: [Toast],
  templateUrl: './finanzas.html',
  styleUrl: './finanzas.css',
})
export class Finanzas {
  constructor(private toastService: ToastService) {}

  showToast(msg: string, type: string = 'info') {
    this.toastService.show(msg, type);
  }


 modales = {
  modalPago: false,
  modalGasto: false,
  modalRecibo: false,
  confirmPago: false
};
abrirModal(modalId: string) {
  this.modales[modalId as keyof typeof this.modales] = true;
}
cerrarModal(modalId: string) {
  this.modales[modalId as keyof typeof this.modales] = false;
}

  //funciona para taps  <!-- TABS -->
  tabActivo: string = 'ingresos';
  switchTab(tabId: string) {
    this.tabActivo = tabId;
  }


  //funcion para ejecutar pago
  ejecutarPago() {
    this.cerrarModal('confirmPago');
    this.cerrarModal('modalPago');
    this.showToast('Pago registrado correctamente', 'success');
  }

  //funcion para abrir recibo
 reciboActual = {
  numero: '',
  alumno: '',
  concepto: '',
  monto: ''
};

// función para abrir recibo
abrirRecibo(
  reciboId: string,
  alumno: string,
  concepto: string,
  monto: string
) {

  this.reciboActual = {
    numero: reciboId,
    alumno,
    concepto,
    monto
  };

  this.abrirModal('modalRecibo');
}
}
