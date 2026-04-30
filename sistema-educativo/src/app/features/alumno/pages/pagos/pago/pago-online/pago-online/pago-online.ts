import { CommonModule ,Location} from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Cuota {
  id: number;
  nombre: string;
  vencimiento: string;
  monto: number;
  estado: string;
  seleccionada: boolean;
}

@Component({
  selector: 'app-pago-online',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pago-online.html',
  styleUrl: './pago-online.css',
})
export class PagoOnline {

  mostrarModal = false;
  // Dentro de tu clase PagoLineaComponent
mostrarModalError = false;

// Método para simular el error al cerrar la pasarela o fallar el pago
cancelarPago() {
  this.mostrarModal = false; // Cierra la pasarela de Izipay
  this.mostrarModalError = true; // Abre el modal de error
}

cerrarModalError() {
  this.mostrarModalError = false;
}

reintentarPago() {
  this.mostrarModalError = false;
  this.mostrarModal = true; // Vuelve a abrir la pasarela
}
  cuotas: Cuota[] = [
    { id: 1, nombre: 'Cuota 1', vencimiento: '26 mar 2026', monto: 758.81, estado: 'Vencido', seleccionada: false },
    { id: 2, nombre: 'Cuota 2', vencimiento: '22 abr 2026', monto: 756.50, estado: 'Vencido', seleccionada: false },
    { id: 3, nombre: 'Cuota 3', vencimiento: '22 may 2026', monto: 755.96, estado: 'Pendiente', seleccionada: false },
    { id: 4, nombre: 'Cuota 4', vencimiento: '22 jun 2026', monto: 755.96, estado: 'Pendiente', seleccionada: false },
    { id: 5, nombre: 'Cuota 5', vencimiento: '22 jul 2026', monto: 755.96, estado: 'Pendiente', seleccionada: false },
  ];

  constructor(private location: Location) {}

  get totalPagar(): number {
    return this.cuotas
      .filter(c => c.seleccionada)
      .reduce((acc, curr) => acc + curr.monto, 0);
  }

  regresar() {
    this.location.back();
  }

  abrirPasarela() {
    if (this.totalPagar > 0) {
      this.mostrarModal = true;
    }
  }

  cerrarPasarela() {
    this.mostrarModal = false;
  }

  formatearMoneda(monto: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(monto);
  }
}
