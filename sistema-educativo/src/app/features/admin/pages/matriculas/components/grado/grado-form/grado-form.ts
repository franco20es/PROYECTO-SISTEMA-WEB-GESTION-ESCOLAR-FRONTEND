import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-grado-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './grado-form.html',
  styleUrl: './grado-form.css',
})
export class GradoForm implements OnInit {
  formGrado: FormGroup;

  // Lista de documentos obligatorios
  documentos = [
    { nombre: 'DNI Estudiante', completo: false },
    { nombre: 'Partida de Nacimiento', completo: false },
    { nombre: 'Certificado de Estudios', completo: false }
  ];

  constructor(private fb: FormBuilder) {
    // Inicializamos el formulario con las validaciones básicas
    this.formGrado = this.fb.group({
      nivel: ['', Validators.required],
      grado: ['', Validators.required],
      seccion: ['', Validators.required],
      tipoMatricula: ['', Validators.required]
    });
  }
canGoNext(): boolean {
    return this.formGrado.valid && this.todosLosDocumentosSubidos();
  }
  ngOnInit(): void {}

  /**
   * Verifica si todos los documentos de la lista tienen el estado 'completo' en true
   */
  todosLosDocumentosSubidos(): boolean {
    return this.documentos.every(doc => doc.completo);
  }

  /**
   * Maneja la selección del archivo
   */
  onFileSelected(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      // Simulación de carga: en un proyecto real aquí llamarías a tu servicio
      console.log(`Subiendo: ${file.name} para ${this.documentos[index].nombre}`);
      
      this.documentos[index].completo = true;
      
      // Llamamos a la validación manual para refrescar la UI
      this.checkFormValidity();
    }
  }

  /**
   * Forzamos la actualización de la validez del formulario.
   * Útil para que los badges de "Completado" en el header se actualicen.
   */
  checkFormValidity() {
    this.formGrado.updateValueAndValidity();
  }

  /**
   * Método para el botón final de Guardar/Enviar
   */
  guardarPaso() {
    this.formGrado.markAllAsTouched(); // Para mostrar errores de validación si faltan selects
    
    if (this.formGrado.valid && this.todosLosDocumentosSubidos()) {
      console.log('Paso 3 completado correctamente:', this.formGrado.value);
      // Lógica para avanzar al siguiente paso o guardar
    } else {
      console.error('Faltan datos o documentos por subir');
    }
  }
}