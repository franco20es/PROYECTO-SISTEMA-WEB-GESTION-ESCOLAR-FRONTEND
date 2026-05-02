import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alumno-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule   
  ],
  templateUrl: './alumno-form.html',
  styleUrls: ['./alumno-form.css']
})
export class AlumnoForm {

  formAlumno: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formAlumno = this.fb.group({
      // Validación: Requerido + Solo letras (con tildes y ñ)
      apellidos: ['', [
        Validators.required, 
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]],
      
      nombres: ['', [
        Validators.required, 
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]],

      tipoDocumento: ['', Validators.required],

      // Validación: Requerido + Exactamente 8 dígitos numéricos
      numeroDocumento: ['', [
        Validators.required, 
        Validators.pattern(/^\d{8}$/)
      ]],

      fechaNacimiento: ['', Validators.required],
      sexo: ['', Validators.required],
      direccion: ['']
    });
  }
}