// pago-online.ts
import { CommonModule, Location } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PagoService } from '../../../../../service/pago.service'; 

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

  private location    = inject(Location);
  private pagoService = inject(PagoService);

  mostrarModal      = false;
  mostrarModalError = false;
  procesandoPago    = false;
  cuotas: Cuota[]   = [];
  errorMensaje      = '';

  // ─── Lifecycle ────────────────────────────────────────────────────────────

  ngOnInit(): void {
    // Si viene desde detalle-pago carga solo esa pensión
    const detalle = sessionStorage.getItem('pagoDetalle');
    if (detalle) {
      const pago = JSON.parse(detalle);
      if (pago.estado === 'PENDIENTE' || pago.estado === 'VENCIDO') {
        this.cuotas = [{
          id:          pago.id,
          nombre:      `Pensión ${pago.mes} ${pago.anio}`,
          vencimiento: pago.fechaVencimiento,
          monto:       pago.totalAPagar,
          estado:      pago.estado,
          seleccionada: true
        }];
        return; // no cargar todas si viene del detalle
      }
    }

    // Si no, carga todas las pensiones pendientes
    const todas = sessionStorage.getItem('pensionesAlumno');
    if (todas) {
      const pensiones = JSON.parse(todas);
      this.cuotas = pensiones
        .filter((p: any) => p.estado === 'PENDIENTE' || p.estado === 'VENCIDO')
        .map((p: any, i: number) => ({
          id:          p.id,
          nombre:      `Pensión ${p.mes} ${p.anio}`,
          vencimiento: p.fechaVencimiento,
          monto:       p.totalAPagar,
          estado:      p.estado,
          seleccionada: i === 0
        }));
    }
  }

  // ─── Getters ──────────────────────────────────────────────────────────────

  get totalPagar(): number {
    return this.cuotas
      .filter(c => c.seleccionada)
      .reduce((acc, curr) => acc + curr.monto, 0);
  }

  get cuotasSeleccionadas(): Cuota[] {
    return this.cuotas.filter(c => c.seleccionada);
  }

  // ─── Pago con MercadoPago ─────────────────────────────────────────────────

  abrirPasarela(): void {
    const seleccionadas = this.cuotasSeleccionadas;
    if (seleccionadas.length === 0) return;

    // Solo se paga una pensión a la vez — la primera seleccionada
    const cuota = seleccionadas[0];
    this.procesandoPago = true;
    this.errorMensaje   = '';

    this.pagoService.crearPreferencia(cuota.id, 'PENSION').subscribe({
      next: (res) => {
        // Redirige al checkout de MercadoPago
        window.location.href = res.initPoint;
      },
      error: (err) => {
        this.procesandoPago = false;
        this.errorMensaje   = err.error?.message || 'Error al procesar el pago';
        this.mostrarModalError = true;
      }
    });
  }

  // ─── Modales ──────────────────────────────────────────────────────────────

  cancelarPago(): void {
    this.mostrarModal      = false;
    this.mostrarModalError = true;
  }

  cerrarModalError(): void {
    this.mostrarModalError = false;
    this.errorMensaje      = '';
  }

  reintentarPago(): void {
    this.mostrarModalError = false;
    this.abrirPasarela();
  }

  cerrarPasarela(): void {
    this.mostrarModal = false;
  }

  // ─── Navegación ───────────────────────────────────────────────────────────

  regresar(): void {
    this.location.back();
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  formatearMoneda(monto: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(monto);
  }
}