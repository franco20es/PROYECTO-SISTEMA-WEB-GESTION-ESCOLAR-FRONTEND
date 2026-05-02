import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-apoderado-form',
   standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './apoderado-form.html',
  styleUrl: './apoderado-form.css',
})
export class ApoderadoForm {
   formApoderado: FormGroup;

  constructor(private fb: FormBuilder) {
   this.formApoderado = this.fb.group({
  nombreCompleto: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
  parentesco: ['', Validators.required],
  dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
  telefono: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
  correo: ['', [Validators.email]], // No es obligatorio, pero si escribe algo debe ser email
  ocupacion: ['']
});
  }
}
