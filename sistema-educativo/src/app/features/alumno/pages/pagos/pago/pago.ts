import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

export interface Pago {
  id: number;
  fecha: string;
  monto: number;
  concepto: string; // Añadido para el template
  metodoPago: string;
  estado: string;
  fechaVencimiento?: string; // Opcional, para pagos pendientes
}

@Component({
  selector: 'app-pago',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pago.html',
  styleUrl: './pago.css',
})
export class PagoAlumno {

  mostrarPendientes: boolean = true;


mostrarPagados: boolean = true;

togglePendientes(): void {
  this.mostrarPendientes = !this.mostrarPendientes;
}

togglePagados(): void {
  this.mostrarPagados = !this.mostrarPagados;
}
  pagos: Pago[] = [
    { id: 1, fecha: '2024-01-15', monto: 500, concepto: 'Matrícula Ciclo VII', metodoPago: 'Tarjeta de Crédito', estado: 'Completado' },
    { id: 2, fecha: '2024-02-15', monto: 500, concepto: 'Cuota 01 - Pensión', metodoPago: 'Transferencia Bancaria', estado: 'Pendiente' },
    { id: 3, fecha: '2024-03-15', monto: 500, concepto: 'Cuota 02 - Pensión', metodoPago: 'Tarjeta de Débito', estado: 'Completado' },
    { id: 4, fecha: '2024-04-15', monto: 500, concepto: 'Cuota 03 - Pensión', metodoPago: 'Efectivo', estado: 'Vencido', fechaVencimiento: '2024-04-30' },
  ];

  //  getters para filtrar
  get pagosPendientes(): Pago[] {
    return this.pagos.filter(p =>
      p.estado === 'Pendiente' || p.estado === 'Vencido'
    );
  }

  get pagosPagados(): Pago[] {
    return this.pagos.filter(p =>
      p.estado === 'Completado'
    );
  }

  historialPagos(): void {
    alert('Procesando pago...');
  }

  verDetalle(pago: Pago): void {
    //  Mejor usar router, pero esto funciona por ahora
    window.location.href = '/alumno/pagos/detalle-pago';
  }
}