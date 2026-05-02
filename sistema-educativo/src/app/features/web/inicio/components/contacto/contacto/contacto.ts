import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contacto',
  imports: [CommonModule, FormsModule],
  templateUrl: './contacto.html',
  styleUrl: './contacto.css',
})
export class Contacto {
    // control de FAQ abierto
  openIndex: number | null = null;

  // modelo formulario
  form = {
    nombre: '',
    apellido: '',
    email: '',
    asunto: '',
    mensaje: ''
  };

  toggleFaq(index: number): void {
    this.openIndex = this.openIndex === index ? null : index;
  }

  sendContact(): void {
    const { nombre, email, asunto, mensaje } = this.form;

    if (!nombre || !email || !asunto || !mensaje) {
      alert('Por favor completa los campos requeridos.');
      return;
    }

    // toast simple
    const toast = document.getElementById('toast');
    if (toast) {
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 4000);
    }

    // limpiar formulario
    this.form = {
      nombre: '',
      apellido: '',
      email: '',
      asunto: '',
      mensaje: ''
    };
  }
}
