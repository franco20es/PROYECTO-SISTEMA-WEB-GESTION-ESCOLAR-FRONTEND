import { CommonModule,Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-opciones-pago',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './opciones-pago.html',
  styleUrl: './opciones-pago.css',
})
export class OpcionesPago {

  // Control de secciones expandibles
  seccionAbierta: string | null = 'apps'; 

  constructor(private location: Location) {}

  toggleSeccion(nombre: string) {
    this.seccionAbierta = this.seccionAbierta === nombre ? null : nombre;
  }

  regresar() {
    this.location.back();
  }

  irAPagarEnLinea() {
    window.location.href='/alumno/pago-online'
  }
}
