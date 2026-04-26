import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm = {
    email: '',
    password: ''
  };
  correo: string = 'rocacalderonjeanfranco@gmail.com';
  password: string = '12345678';
  googleLoading: boolean = false;
  rememberMe: boolean = false;
isLoading: boolean = false;
  showPassword: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  constructor(private router: Router) {}

  login() {
    if (this.loginForm.email === 'rocacalderonjeanfranco@gmail.com' && this.loginForm.password === '12345678') {
      // Login exitoso (ficticio)
      this.router.navigate(['/admin/dashboard']);
      this.successMessage = 'Login exitoso';
    } else {
      this.errorMessage = 'Credenciales incorrectas';
    }
  }

  onSubmit() {
    this.login();
  }

  onGoogleLogin() {
    this.googleLoading = true;
    // Simulación de login con Google
    setTimeout(() => {
      this.googleLoading = false;
      alert('Login con Google (ficticio)');
      this.router.navigate(['/admin/dashboard']);
    }, 1500);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  clearMessages() {
    this.successMessage = '';
    this.errorMessage = '';
  }
}