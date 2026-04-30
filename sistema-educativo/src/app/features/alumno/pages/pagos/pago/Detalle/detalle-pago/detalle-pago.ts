import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

export interface DetalleCuotaPago {
  titulo: string;
  estado: 'Vencido' | 'Pagado' | 'Pendiente';
  tipo: string;
  ciclo: string;
  fechaVencimiento: Date;
  subtotal: number;
  mora: number;
  total: number;
}

@Component({
  selector: 'app-detalle-pago',
  standalone: true,
  imports: [CommonModule], // Ya no importamos DatePipe ni CurrencyPipe
  templateUrl: './detalle-pago.html',
  styleUrl: './detalle-pago.css',
})
export class DetallePagoComponent implements OnInit {
  idPago: string | null = null;
  
  pago: DetalleCuotaPago = {
    titulo: 'Cuota 1',
    estado: 'Vencido',
    tipo: 'Pensiones',
    ciclo: '2026 - Ciclo 1 Marzo',
    fechaVencimiento: new Date(2026, 2, 26), 
    subtotal: 755.96,
    mora: 2.85,
    total: 758.81
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.idPago = this.route.snapshot.paramMap.get('id');
  }

  // Formatea la fecha a: "26 mar 2026"
  get fechaVencimientoTexto(): string {
    return new Intl.DateTimeFormat('es-PE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(this.pago.fechaVencimiento).replace('.', '');
  }

  // Formatea a moneda: "S/ 758.81"
  formatearMoneda(monto: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(monto);
  }

  onOpcionesPago(): void {
    window.location.href = '/alumno/opciones-pago'; // Redirige a la página de opciones de pago
  }
}