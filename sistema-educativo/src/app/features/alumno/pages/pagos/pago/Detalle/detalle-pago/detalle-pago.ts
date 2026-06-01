import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detalle-pago',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-pago.html',
  styleUrl: './detalle-pago.css',
})
export class DetallePagoComponent implements OnInit {

  private router = inject(Router);
  pago: any = null;

  get fechaVencimientoTexto(): string {
    if (!this.pago?.fechaVencimiento) return '—';
    const fecha = new Date(this.pago.fechaVencimiento);
    return fecha.toLocaleDateString('es-PE', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  }

  formatearMoneda(monto: number): string {
    return `S/ ${(monto || 0).toFixed(2)}`;
  }

  ngOnInit(): void {
    const data = sessionStorage.getItem('pagoDetalle');
    if (data) {
      this.pago = JSON.parse(data);
    } else {
      this.router.navigate(['/alumno/pagos']);
    }
  }

  onOpcionesPago(): void {
    this.router.navigate(['/alumno/opciones-pago']);
  }

  volver(): void {
    this.router.navigate(['/alumno/pagos']);
  }
}