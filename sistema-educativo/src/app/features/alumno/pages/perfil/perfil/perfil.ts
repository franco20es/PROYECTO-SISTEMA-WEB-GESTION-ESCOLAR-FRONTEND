import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class PerfilAlumno {
  editando = false;
  guardado = false;

  alumno = {
    nombre: 'Juan Carlos López',
    iniciales: 'JCL',
    grado: 'Sexto de Primaria - Sección A'
  };

  form = {
    codigo: 'EST-2024-001',
    dni: '12345678',
    correo: 'juan.lopez@colegio.edu.pe',
    telefono: '987654321',
    apoderado: 'María López García',
    telefonoApoderado: '987654320'
  };

  formBackup = { ...this.form };

  cancelar() {
    this.form = { ...this.formBackup };
    this.editando = false;
  }

  guardar() {
    this.formBackup = { ...this.form };
    this.editando = false;
    this.guardado = true;
    setTimeout(() => this.guardado = false, 3000);
  }
}
