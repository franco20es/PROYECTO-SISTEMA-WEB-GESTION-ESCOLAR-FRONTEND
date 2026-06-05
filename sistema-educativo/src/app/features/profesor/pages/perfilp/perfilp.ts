import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PerfilDocenteService } from '../../services/perfil.service'; 
import { ToastService } from '../../../../core/services/toast/toast.service';// ajusta la ruta

@Component({
  selector: 'app-perfilp',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfilp.html',
  styleUrl: './perfilp.css',
})
export class Perfilp implements OnInit {

  private perfilService = inject(PerfilDocenteService);
  private toast         = inject(ToastService);

  cargando = signal(true);
  guardando = signal(false);
  cambiandoPass = signal(false);

  perfil = signal<any>(null);

  // Campos editables (van al backend)
  contacto = { telefono: '', email: '', direccion: '' };

  // Cambio de contraseña
  pass = { actual: '', nueva: '', confirmar: '' };

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.perfilService.miPerfil().subscribe({
      next: (data) => {
        this.perfil.set(data);
        this.contacto = {
          telefono: data.telefono || '',
          email: data.email || '',
          direccion: data.direccion || ''
        };
        this.cargando.set(false);
      },
      error: () => {
        this.toast.show('No se pudo cargar tu perfil', 'error');
        this.cargando.set(false);
      }
    });
  }

  guardarContacto(): void {
    this.guardando.set(true);
    this.perfilService.actualizarContacto(this.contacto).subscribe({
      next: (data) => {
        this.perfil.set(data);
        this.guardando.set(false);
        this.toast.show('Perfil actualizado correctamente', 'ok');
      },
      error: (err) => {
        this.guardando.set(false);
        this.toast.show(err.error?.message || 'Error al actualizar', 'error');
      }
    });
  }

  cancelarContacto(): void {
    const p = this.perfil();
    if (p) {
      this.contacto = {
        telefono: p.telefono || '',
        email: p.email || '',
        direccion: p.direccion || ''
      };
    }
  }

  cambiarPassword(): void {
    if (!this.pass.actual || !this.pass.nueva || !this.pass.confirmar) {
      this.toast.show('Completa todos los campos', 'warn');
      return;
    }
    if (this.pass.nueva.length < 8) {
      this.toast.show('La nueva contraseña debe tener mínimo 8 caracteres', 'warn');
      return;
    }
    if (this.pass.nueva !== this.pass.confirmar) {
      this.toast.show('Las contraseñas no coinciden', 'warn');
      return;
    }

    // usuarioId del login (AuthResponse.id). Ajusta la clave de tu localStorage.
    const usuarioId = localStorage.getItem('usuarioId') || localStorage.getItem('userId') || '';
    if (!usuarioId) {
      this.toast.show('No se encontró tu sesión, vuelve a iniciar sesión', 'error');
      return;
    }

    this.cambiandoPass.set(true);
    this.perfilService.cambiarPassword(usuarioId, {
      passwordActual: this.pass.actual,
      passwordNueva: this.pass.nueva
    }).subscribe({
      next: () => {
        this.cambiandoPass.set(false);
        this.pass = { actual: '', nueva: '', confirmar: '' };
        this.toast.show('Contraseña actualizada correctamente', 'ok');
      },
      error: (err) => {
        this.cambiandoPass.set(false);
        this.toast.show(err.error?.message || 'Error al cambiar contraseña', 'error');
      }
    });
  }
}