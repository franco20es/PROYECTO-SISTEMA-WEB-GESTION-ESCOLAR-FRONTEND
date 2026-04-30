import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { SpinnerComponent } from '../../../../../../core/components/spiner/spiner/spiner';
import { CommonModule } from '@angular/common';

interface Alumno {
  nombre: string;
  codigo: string;
  periodo: string;
}

@Component({
  selector: 'app-datos-alumno',
  standalone: true,
  imports: [SpinnerComponent,CommonModule],
  templateUrl: './datos-alumno.html',
  styleUrl: './datos-alumno.css',
})
export class DatosAlumno implements OnInit {
  cargandoDatos: boolean = true;
  alumno: Alumno = {
    nombre: 'Jean Franco Roca Calderon',
    codigo: 'U23206542',
    periodo: '2024-2'
  };
  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.cargandoDatos = false;
      this.cdRef.detectChanges();
    }, 200); // Simula una carga de datos de 2 segundos
  }
}
