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
  router = inject(Router); // ← sin private

  loginForm = {
    email: '',
    password: ''
  };
  isLoading = false;
  error = '';
  successMessage = '';
  errorMessage = '';
  showPassword = false;
  rememberMe = false;

  login(): void {
    if (!this.loginForm.email || !this.loginForm.password) {
      this.error = 'Completa todos los campos';
      return;
    }
    this.isLoading = true;
    this.error = '';

    this.auth.login(this.loginForm.email, this.loginForm.password).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.auth.redirigirSegunRol(res.rol);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.status === 401
          ? 'Credenciales incorrectas'
          : 'Error al conectar con el servidor';
      }
    });
  }

  onSubmit() {
    this.login();
  }

 
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  clearMessages() {
    this.successMessage = '';
    this.errorMessage = '';
  }
}