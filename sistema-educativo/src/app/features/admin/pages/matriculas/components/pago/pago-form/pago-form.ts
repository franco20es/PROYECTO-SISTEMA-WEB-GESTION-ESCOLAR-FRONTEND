import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-pago-form',
    standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './pago-form.html',
  styleUrl: './pago-form.css',
})
export class PagoForm {

 formPago: FormGroup;

  // Datos de ejemplo para el resumen
  resumen = {
    grado: '5° Secundaria',
    matricula: 450,
    pension: 800,
    materiales: 200
  };

  total: number = 0;

  constructor(private fb: FormBuilder) {
    this.formPago = this.fb.group({
      modalidad: ['MENSUAL', Validators.required],
      descuento: ['NINGUNO', Validators.required],
      observaciones: [''],
      aceptaTerminos: [false, Validators.requiredTrue], // Obligatorio marcarlo
      enviarEmail: [true],
      accesoPortal: [true]
    });
  }

  ngOnInit(): void {
    this.calcularTotal();
    // Recalcular cada vez que cambien los selects
    this.formPago.valueChanges.subscribe(() => this.calcularTotal());
  }

  calcularTotal() {
    const base = this.resumen.matricula + this.resumen.pension + this.resumen.materiales;
    // Lógica simple de ejemplo para los descuentos mostrados en el UI
    let desc = 0;
    const descTipo = this.formPago.get('descuento')?.value;
    if (descTipo === 'HERMANO') desc = 0.10;
    if (descTipo === 'CONVENIO') desc = 0.15;
    if (descTipo === 'BECA') desc = 0.50;

    this.total = base - (this.resumen.pension * desc);
  }
}
