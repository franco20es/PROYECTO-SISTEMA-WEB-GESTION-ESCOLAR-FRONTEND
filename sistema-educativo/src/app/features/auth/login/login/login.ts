import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AutenticacionService } from '../../../../core/services/autenticacion/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private auth = inject(AutenticacionService);
  router = inject(Router);

  loginForm = {
    email: '',
    password: ''
  };
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;
  rememberMe = false;

  // Validación simple de email
  emailValido(): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(this.loginForm.email.trim());
  }

  // El formulario es válido si email tiene formato y password no está vacío
  formValido(): boolean {
    return this.emailValido() && this.loginForm.password.trim().length > 0;
  }

  login(): void {
    this.errorMessage = '';

    if (!this.loginForm.email || !this.loginForm.password) {
      this.errorMessage = 'Completa todos los campos';
      return;
    }
    if (!this.emailValido()) {
      this.errorMessage = 'Ingresa un email válido';
      return;
    }

    this.isLoading = true;

    this.auth.login(this.loginForm.email, this.loginForm.password).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.auth.redirigirSegunRol(res.rol);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.status === 401
          ? 'Credenciales incorrectas. Verifica tu email y contraseña.'
          : 'Error al conectar con el servidor. Intenta de nuevo.';
      }
    });
  }

  onSubmit(): void {
    this.login();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
}