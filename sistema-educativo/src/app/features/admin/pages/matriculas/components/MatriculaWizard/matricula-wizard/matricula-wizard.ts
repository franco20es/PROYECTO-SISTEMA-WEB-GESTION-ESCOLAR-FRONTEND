import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { AlumnoForm } from '../../alumno-form/alumno-form/alumno-form';
import { ApoderadoForm } from '../../apoderado-form/apoderado-form/apoderado-form';
import { GradoForm } from '../../grado/grado-form/grado-form';
import { PagoForm } from '../../pago/pago-form/pago-form';
import { ConfirmacionMatricula } from "../../modal/confirmacionMatruicula/confirmacion-matricula/confirmacion-matricula";

@Component({
  selector: 'app-matricula-wizard',
  standalone: true,
  imports: [
    CommonModule,
    AlumnoForm,
    ApoderadoForm,
    GradoForm,
    PagoForm,
    ConfirmacionMatricula
],
  templateUrl: './matricula-wizard.html',
  styleUrl: './matricula-wizard.css',
})
export class MatriculaWizard {

  showModal = false;
confirmacion: any = null;

  currentStep = 1;

  //  OPCIONAL SEGURO
  @ViewChild(AlumnoForm) alumno?: AlumnoForm;
  @ViewChild(ApoderadoForm) apoderado?: ApoderadoForm;
  @ViewChild(GradoForm) grado?: GradoForm;
  @ViewChild(PagoForm) pago?: PagoForm;

  //  navegación
  next() {
    if (this.canGoNext()) this.currentStep++;
  }

  prev() {
    if (this.currentStep > 1) this.currentStep--;
  }

  //  validación segura
  canGoNext(): boolean {
    switch (this.currentStep) {
      case 1: return this.alumno?.formAlumno?.valid ?? false;
      case 2: return this.apoderado?.formApoderado?.valid ?? false;
      case 3: return this.grado?.formGrado?.valid ?? false;
      case 4: return this.pago?.formPago?.valid ?? false;
      default: return false;
    }
  }

  // guardar borrador
  guardarBorrador() {
    const data = this.getData();
    localStorage.setItem('matricula', JSON.stringify(data));
    console.log('Guardado');
  }

 submit() {
  const data = this.getData();

  console.log('ENVIANDO:', data);

  // simular respuesta o usar backend real
  this.confirmacion = {
    nombre: data.alumno?.nombre,
    dni: data.alumno?.dni,
    anio: data.grado?.anio,
    nivel: data.grado?.nivel,
    grado: data.grado?.grado,
    seccion: data.grado?.seccion,
    usuario: 'U' + Math.floor(Math.random() * 10000).toString().padStart(8, '0'), // simulado 8 digitos
    contrasena: 'P' + Math.floor(Math.random() * 10000).toString().padStart(8, '0'), // simulado 8 digitos
    codigo: 'MAT-' + Math.floor(Math.random() * 10000).toString().padStart(8, '0')
  };

  //  SOLO ABRIR MODAL
  this.showModal = true;
}

nuevaMatricula(){
   this.showModal = false;
  this.currentStep = 1;

  this.alumno?.formAlumno.reset();
  this.apoderado?.formApoderado.reset();
  this.grado?.formGrado.reset({ tipoMatricula: 'NUEVO' });
  this.pago?.formPago.reset();

  localStorage.removeItem('matricula');
}

  //  helper (PRO)
  private getData() {
    return {
      alumno: this.alumno?.formAlumno?.value,
      apoderado: this.apoderado?.formApoderado?.value,
      grado: this.grado?.formGrado?.value,
      pago: this.pago?.formPago?.value
    };
  }
  cancelar() {
  console.log(' Cancelado');

  // opcional: resetear
  this.currentStep = 1;

  // opcional PRO: limpiar borrador
  localStorage.removeItem('matricula');
}
}