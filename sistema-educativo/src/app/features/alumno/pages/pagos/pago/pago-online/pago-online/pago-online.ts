import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Cuota {
  id: string;
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
export class PagoOnline implements OnInit {

  mostrarModal = false;
  mostrarModalError = false;
  cuotas: Cuota[] = [];

  constructor(private location: Location) {}

  ngOnInit(): void {
    // ← leer pensiones del sessionStorage
    const data = sessionStorage.getItem('pagoDetalle');
    if (data) {
      const pago = JSON.parse(data);
      // si viene un solo pago del detalle, lo agrega como cuota
      this.cuotas = [{
        id: pago.id,
        nombre: `Pensión ${pago.mes} ${pago.anio}`,
        vencimiento: pago.fechaVencimiento,
        monto: pago.totalAPagar,
        estado: pago.estado,
        seleccionada: true // ← preseleccionada
      }];
    }

    // también carga todas las pensiones pendientes si están guardadas
    const todas = sessionStorage.getItem('pensionesAlumno');
    if (todas) {
      const pensiones = JSON.parse(todas);
      this.cuotas = pensiones
        .filter((p: any) => p.estado === 'PENDIENTE' || p.estado === 'VENCIDO')
        .map((p: any, i: number) => ({
          id: p.id,
          nombre: `Pensión ${p.mes} ${p.anio}`,
          vencimiento: p.fechaVencimiento,
          monto: p.totalAPagar,
          estado: p.estado,
          seleccionada: i === 0 // ← preselecciona la primera
        }));
    }
  }

  get totalPagar(): number {
    return this.cuotas
      .filter(c => c.seleccionada)
      .reduce((acc, curr) => acc + curr.monto, 0);
  }

  cancelarPago() {
    this.mostrarModal = false;
    this.mostrarModalError = true;
  }

  cerrarModalError() {
    this.mostrarModalError = false;
  }

  reintentarPago() {
    this.mostrarModalError = false;
    this.mostrarModal = true;
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