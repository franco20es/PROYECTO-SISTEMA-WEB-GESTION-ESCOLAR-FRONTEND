import { Component, inject } from '@angular/core';
import { environment } from '../../../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AutenticacionService } from '../../../../core/services/autenticacion/auth.service';
import { RecuperarPasswordService } from '../../service/RecuperarPassword.Service';

@Component({
  selector: 'app-recuperar-contrasena',
    standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './recuperar-contrasena.html',
  styleUrl: './recuperar-contrasena.css',
})
export class RecuperarPassword {
 
  private service = inject(RecuperarPasswordService);
 
  email = '';
  isLoading = false;
  errorMessage = '';
  enviado = false; // muestra mensaje de éxito
 
  solicitar(): void {
    if (!this.email || !this.email.includes('@')) {
      this.errorMessage = 'Ingresa un email válido';
      return;
    }
 
    this.isLoading = true;
    this.errorMessage = '';
 
    this.service.solicitarRecuperacion(this.email).subscribe({
      next: () => {
        this.isLoading = false;
        this.enviado = true;
      },
      error: () => {
        this.isLoading = false;
        // No revelar si el email existe o no — mensaje genérico
        this.enviado = true;
      }
    });
  }
}