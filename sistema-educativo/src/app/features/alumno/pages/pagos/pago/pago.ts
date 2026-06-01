import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { environment } from '../../../../../../environment/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

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

   private http = inject(HttpClient);
  private api = environment.apiUrl;
 
  cargando = true;
  anio = new Date().getFullYear();
 
  todasLasPensiones: any[] = [];
  mostrarPendientes = true;
  mostrarPagados = false;
 
  pagoSeleccionado: any = null;
  modalVisible = false;
 
  toast = { visible: false, mensaje: '', tipo: 'ok' as 'ok' | 'error' };
  private toastTimeout: any;
 
  ngOnInit(): void {
    this.cargarPensiones();
  }
 
cargarPensiones(): void {
  this.cargando = true;
  const params = new HttpParams()
    .set('anio', this.anio)
    .set('page', 0)
    .set('size', 12);

  this.http.get<any>(`${this.api}/portal/alumno/pensiones`, { params }).subscribe({
    next: (res) => {
      this.todasLasPensiones = res.content || [];
      // ← guardar en sessionStorage para pago-online
      sessionStorage.setItem('pensionesAlumno', JSON.stringify(this.todasLasPensiones));
      this.cargando = false;
    },
    error: () => {
      this.showToast('Error al cargar los pagos', 'error');
      this.cargando = false;
    }
  });
}
 
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
 
  togglePendientes(): void {
    this.mostrarPendientes = !this.mostrarPendientes;
  }
 
  togglePagados(): void {
    this.mostrarPagados = !this.mostrarPagados;
  }
 

 
  cerrarModal(): void {
    this.modalVisible = false;
    this.pagoSeleccionado = null;
  }
 
  historialPagos(): void {
    this.mostrarPagados = true;
    this.mostrarPendientes = true;
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


  get pagoDetalle() {
  if (!this.pagoSeleccionado) return null;
  return {
    titulo: `Pensión ${this.pagoSeleccionado.mes} ${this.pagoSeleccionado.anio}`,
    estado: this.pagoSeleccionado.estado,
    tipo: 'Pensión mensual',
    ciclo: `${this.pagoSeleccionado.mes} ${this.pagoSeleccionado.anio}`,
    subtotal: this.pagoSeleccionado.monto,
    mora: this.pagoSeleccionado.mora || 0,
    total: this.pagoSeleccionado.totalAPagar,
    fechaVencimiento: this.pagoSeleccionado.fechaVencimiento,
    referencia: this.pagoSeleccionado.referenciaBancaria
  };
}

get fechaVencimientoTexto(): string {
  if (!this.pagoSeleccionado?.fechaVencimiento) return '—';
  const fecha = new Date(this.pagoSeleccionado.fechaVencimiento);
  return fecha.toLocaleDateString('es-PE', { 
    day: '2-digit', month: 'long', year: 'numeric' 
  });
}

formatearMoneda(monto: number): string {
  return `S/ ${(monto || 0).toFixed(2)}`;
}

onOpcionesPago(): void {
  this.showToast('Opciones de pago próximamente', 'ok');
}
// en la clase
private router = inject(Router);

// reemplaza verDetalle()
verDetalle(pago: any): void {
  // guarda el pago en sessionStorage para que detalle lo lea
  sessionStorage.setItem('pagoDetalle', JSON.stringify(pago));
  this.router.navigate(['/alumno/pagos/detalle-pago']);
}

}