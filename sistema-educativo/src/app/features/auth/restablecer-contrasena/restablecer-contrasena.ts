// restablecer-contrasena.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RecuperarPasswordService } from '../service/RecuperarPassword.Service'; 

@Component({
  selector: 'app-restablecer-contrasena',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './restablecer-contrasena.html',
  styleUrl: './restablecer-contrasena.css'
})
export class RestablecerPassword implements OnInit {

  private service = inject(RecuperarPasswordService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  token = '';
  passwordNuevo = '';
  confirmarPassword = '';
  mostrarPassword = false;
  mostrarConfirmar = false;

  isLoading = false;
  errorMessage = '';
  exitoso = false;
  tokenInvalido = false;

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    if (!this.token) this.tokenInvalido = true;
  }

  // ─── Validaciones ─────────────────────────────────────────────────────────

  get passwordsCoinciden(): boolean {
    return this.passwordNuevo === this.confirmarPassword && this.confirmarPassword !== '';
  }

  get passwordValida(): boolean {
    return this.passwordNuevo.length >= 8 &&
           /[A-Z]/.test(this.passwordNuevo) &&
           /\d/.test(this.passwordNuevo);
  }

  // ─── Barra de fortaleza ───────────────────────────────────────────────────

  get strengthPercent(): number {
    let score = 0;
    const p = this.passwordNuevo;
    if (p.length >= 8)  score += 25;
    if (p.length >= 12) score += 15;
    if (/[A-Z]/.test(p)) score += 20;
    if (/\d/.test(p))    score += 20;
    if (/[^A-Za-z0-9]/.test(p)) score += 20;
    return Math.min(score, 100);
  }

  get strengthColor(): string {
    const pct = this.strengthPercent;
    if (pct < 30) return '#EF4444';
    if (pct < 60) return '#F59E0B';
    if (pct < 80) return '#3B82F6';
    return '#10B981';
  }

  get strengthLabel(): string {
    const pct = this.strengthPercent;
    if (pct < 30) return 'Débil';
    if (pct < 60) return 'Regular';
    if (pct < 80) return 'Buena';
    return 'Fuerte';
  }

  // ─── Acción ───────────────────────────────────────────────────────────────

  restablecer(): void {
    if (!this.passwordValida) {
      this.errorMessage = 'La contraseña debe tener mínimo 8 caracteres, una mayúscula y un número';
      return;
    }
    if (!this.passwordsCoinciden) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.service.restablecerPassword(this.token, this.passwordNuevo).subscribe({
      next: () => {
        this.isLoading = false;
        this.exitoso = true;
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'El enlace ha expirado. Solicita uno nuevo.';
      }
    });
  }
}