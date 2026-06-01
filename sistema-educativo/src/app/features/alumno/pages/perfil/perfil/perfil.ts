import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../../../environment/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class PerfilAlumno implements OnInit {

  private http = inject(HttpClient);
  private api = environment.apiUrl;

  // ─── Estado ───────────────────────────────────────────────────────────────
  cargando = true;
  guardando = false;
  cambiandoPassword = false;

  // ─── Datos del alumno ────────────────────────────────────────────────────
  alumno: any = null;
  matricula: any = null;

  // ─── Formulario editable ─────────────────────────────────────────────────
  form = {
    direccion: '',
    telefonoApoderado: '',
    emailApoderado: ''
  };

  // ─── Cambio de contraseña ─────────────────────────────────────────────────
  passForm = {
    passwordActual: '',
    passwordNuevo: '',
    confirmarPassword: ''
  };
  mostrarPassActual = false;
  mostrarPassNuevo = false;
  mostrarPassConfirm = false;

  // ─── Toast ────────────────────────────────────────────────────────────────
  toast = { visible: false, mensaje: '', tipo: 'ok' as 'ok' | 'error' | 'warn' | 'info' };
  private toastTimeout: any;

  ngOnInit(): void {
    this.cargarPerfil();
  }

  // ─── Cargar datos ─────────────────────────────────────────────────────────
  cargarPerfil(): void {
    const anio = new Date().getFullYear();

    // ← usar portal en vez de /alumnos/{id} directo
    this.http.get<any>(`${this.api}/portal/alumno/perfil`).subscribe({
      next: (data) => {
        this.alumno = data;
        this.form.direccion = data.direccion || '';
        this.form.telefonoApoderado = data.telefonoApoderado || '';
        this.form.emailApoderado = data.emailApoderado || '';
        this.cargando = false;
      },
      error: () => {
        this.showToast('Error al cargar el perfil', 'error');
        this.cargando = false;
      }
    });

    // matrícula activa
    this.http.get<any>(`${this.api}/portal/alumno/matricula/${anio}`).subscribe({
      next: (data) => this.matricula = data,
      error: () => this.matricula = null
    });
  }




  // ─── Guardar cambios ──────────────────────────────────────────────────────
  guardarCambios(): void {
    if (!this.alumno) return;
    this.guardando = true;

    const payload = {
      ...this.alumno,
      direccion: this.form.direccion,
      telefonoApoderado: this.form.telefonoApoderado,
      emailApoderado: this.form.emailApoderado
    };

    this.http.put(`${this.api}/alumnos/${this.alumno.id}`, payload).subscribe({
      next: () => {
        this.guardando = false;
        this.showToast('Perfil actualizado correctamente', 'ok');
      },
      error: () => {
        this.guardando = false;
        this.showToast('Error al guardar los cambios', 'error');
      }
    });
  }

  // ─── Cambiar contraseña ───────────────────────────────────────────────────
  cambiarPassword(): void {
    if (!this.passForm.passwordActual) {
      this.showToast('Ingresa tu contraseña actual', 'warn'); return;
    }
    if (this.passForm.passwordNuevo.length < 8) {
      this.showToast('La contraseña debe tener mínimo 8 caracteres', 'warn'); return;
    }
    if (!/(?=.*[A-Z])(?=.*\d)/.test(this.passForm.passwordNuevo)) {
      this.showToast('Debe tener al menos una mayúscula y un número', 'warn'); return;
    }
    if (this.passForm.passwordNuevo !== this.passForm.confirmarPassword) {
      this.showToast('Las contraseñas no coinciden', 'warn'); return;
    }

    this.cambiandoPassword = true;
    const usuarioId = localStorage.getItem('usuarioId');

    this.http.patch(`${this.api}/portal/alumno/cambiar-password`, {
      passwordActual: this.passForm.passwordActual,
      passwordNuevo: this.passForm.passwordNuevo
    }).subscribe({
      next: () => {
        this.cambiandoPassword = false;
        this.passForm = { passwordActual: '', passwordNuevo: '', confirmarPassword: '' };
        this.showToast('Contraseña actualizada correctamente', 'ok');
      },
      error: (err) => {                          
        this.cambiandoPassword = false;
        this.showToast(
          err.status === 400 || err.status === 401
            ? 'Contraseña actual incorrecta'
            : 'Error al cambiar la contraseña',
          'error'
        );
      }
    });
  }



  // ─── Helpers ──────────────────────────────────────────────────────────────
  get iniciales(): string {
    if (!this.alumno) return 'AL';
    return `${this.alumno.nombres?.charAt(0) || ''}${this.alumno.apellidos?.charAt(0) || ''}`.toUpperCase();
  }

  get gradoSeccion(): string {
    if (!this.matricula) return '—';
    return `${this.matricula.grado}° ${this.matricula.seccionDenominacion || '?'} — ${this.matricula.nivel}`;
  }

  showToast(mensaje: string, tipo: 'ok' | 'error' | 'warn' | 'info' = 'ok'): void {
    clearTimeout(this.toastTimeout);
    this.toast = { visible: true, mensaje, tipo };
    this.toastTimeout = setTimeout(() => this.toast.visible = false, 3200);
  }
}
