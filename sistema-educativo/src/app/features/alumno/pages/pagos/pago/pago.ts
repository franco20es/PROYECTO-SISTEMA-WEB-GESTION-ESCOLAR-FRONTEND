// pago.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PagoService } from '../../../service/pago.service';

export interface Pago {
  id: string;
  fecha: string;
  monto: number;
  concepto: string;
  metodoPago: string;
  estado: string;
  fechaVencimiento?: string;
}

@Component({
  selector: 'app-pago',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pago.html',
  styleUrl: './pago.css',
})
export class PagoAlumno implements OnInit {

  private pagoService = inject(PagoService);
  private router      = inject(Router);
  private route       = inject(ActivatedRoute);

  cargando  = true;
  anio      = new Date().getFullYear();

  todasLasPensiones: any[] = [];
  mostrarPendientes = true;
  mostrarPagados    = false;

  pagoSeleccionado: any = null;
  modalVisible = false;

  toast = { visible: false, mensaje: '', tipo: 'ok' as 'ok' | 'error' };
  private toastTimeout: any;

  // ─── Lifecycle ────────────────────────────────────────────────────────────

  ngOnInit(): void {
    // Leer estado del retorno de MercadoPago
    this.route.queryParams.subscribe(params => {
      if (params['estado'] === 'exitoso') {
        this.showToast('¡Pago realizado correctamente!', 'ok');
      } else if (params['estado'] === 'fallido') {
        this.showToast('El pago fue rechazado. Intenta de nuevo.', 'error');
      } else if (params['estado'] === 'pendiente') {
        this.showToast('Pago pendiente de confirmación.', 'ok');
      }
    });

    this.cargarPensiones();
  }

  // ─── Carga de datos ───────────────────────────────────────────────────────

  cargarPensiones(): void {
    this.cargando = true;
    this.pagoService.getPensiones(this.anio).subscribe({
      next: (res) => {
        this.todasLasPensiones = res.content || [];
        sessionStorage.setItem('pensionesAlumno', JSON.stringify(this.todasLasPensiones));
        this.cargando = false;
      },
      error: () => {
        this.showToast('Error al cargar los pagos', 'error');
        this.cargando = false;
      }
    });
  }

  // ─── Getters ──────────────────────────────────────────────────────────────

  get pagosPendientes(): any[] {
    return this.todasLasPensiones.filter(p =>
      p.estado === 'PENDIENTE' || p.estado === 'VENCIDO'
    );
  }

  get pagosPagados(): any[] {
    return this.todasLasPensiones.filter(p => p.estado === 'PAGADO');
  }

  get totalDeuda(): number {
    return this.pagosPendientes.reduce((sum, p) => sum + (p.totalAPagar || 0), 0);
  }

  get totalPagado(): number {
    return this.pagosPagados.reduce((sum, p) => sum + (p.monto || 0), 0);
  }

  get pagoDetalle() {
    if (!this.pagoSeleccionado) return null;
    return {
      titulo:          `Pensión ${this.pagoSeleccionado.mes} ${this.pagoSeleccionado.anio}`,
      estado:          this.pagoSeleccionado.estado,
      tipo:            'Pensión mensual',
      ciclo:           `${this.pagoSeleccionado.mes} ${this.pagoSeleccionado.anio}`,
      subtotal:        this.pagoSeleccionado.monto,
      mora:            this.pagoSeleccionado.mora || 0,
      total:           this.pagoSeleccionado.totalAPagar,
      fechaVencimiento:this.pagoSeleccionado.fechaVencimiento,
      referencia:      this.pagoSeleccionado.referenciaBancaria
    };
  }

  get fechaVencimientoTexto(): string {
    if (!this.pagoSeleccionado?.fechaVencimiento) return '—';
    const fecha = new Date(this.pagoSeleccionado.fechaVencimiento);
    return fecha.toLocaleDateString('es-PE', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  }

  // ─── Acciones ─────────────────────────────────────────────────────────────

  verDetalle(pago: any): void {
    sessionStorage.setItem('pagoDetalle', JSON.stringify(pago));
    this.router.navigate(['/alumno/pagos/detalle-pago']);
  }

  togglePendientes(): void { this.mostrarPendientes = !this.mostrarPendientes; }
  togglePagados(): void    { this.mostrarPagados    = !this.mostrarPagados;    }

  historialPagos(): void {
    this.mostrarPagados    = true;
    this.mostrarPendientes = true;
  }

  cerrarModal(): void {
    this.modalVisible    = false;
    this.pagoSeleccionado = null;
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  formatearMoneda(monto: number): string {
    return `S/ ${(monto || 0).toFixed(2)}`;
  }

  getMesNumero(mes: string): string {
    const meses: Record<string, string> = {
      ENERO: '01', FEBRERO: '02', MARZO: '03', ABRIL: '04',
      MAYO: '05', JUNIO: '06', JULIO: '07', AGOSTO: '08',
      SEPTIEMBRE: '09', OCTUBRE: '10', NOVIEMBRE: '11', DICIEMBRE: '12'
    };
    return meses[mes] || '??';
  }

  showToast(mensaje: string, tipo: 'ok' | 'error' = 'ok'): void {
    clearTimeout(this.toastTimeout);
    this.toast = { visible: true, mensaje, tipo };
    this.toastTimeout = setTimeout(() => this.toast.visible = false, 3200);
  }
}