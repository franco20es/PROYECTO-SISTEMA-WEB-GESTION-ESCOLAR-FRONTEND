import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

// ── Types ──────────────────────────────────────────────────────────────────
export type TabPerfil = 'datos' | 'academico' | 'seguridad';

export interface MateriaAsignada {
  id: number;
  nombre: string;
  grado: string;
  seccion: string;
  horario: string;
  estudiantes: number;
}

export interface HorarioDia {
  dia: string;
  bloques: { hora: string; materia: string; grado: string }[];
}

export interface ProfesorData {
  id: number;
  codigo: string;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
  direccion: string;
  especialidad: string;
  titulo: string;
  aniosExperiencia: number;
  estado: 'Activo' | 'Inactivo';
  fechaIngreso: string;
  foto: string;
}

// ── Mock Data ──────────────────────────────────────────────────────────────
const MOCK_PROFESOR: ProfesorData = {
  id: 1,
  codigo: 'DOC-2024-001',
  nombres: 'María Elena',
  apellidos: 'Rodríguez Paredes',
  correo: 'maria.rodriguez@colegio.edu.pe',
  telefono: '987 654 321',
  direccion: 'Av. Los Álamos 234, San Borja, Lima',
  especialidad: 'Matemáticas',
  titulo: 'Licenciada en Educación',
  aniosExperiencia: 8,
  estado: 'Activo',
  fechaIngreso: '2016-03-01',
  foto: ''
};

const MOCK_MATERIAS: MateriaAsignada[] = [
  { id: 1, nombre: 'Matemáticas',  grado: '1°',  seccion: 'A', horario: 'Lun/Mié/Vie 08:00-09:30', estudiantes: 32 },
  { id: 2, nombre: 'Matemáticas',  grado: '1°',  seccion: 'B', horario: 'Mar/Jue 08:00-09:30',     estudiantes: 30 },
  { id: 3, nombre: 'Matemáticas',  grado: '2°',  seccion: 'A', horario: 'Lun/Mié/Vie 10:00-11:30', estudiantes: 28 },
  { id: 4, nombre: 'Algebra',      grado: '3°',  seccion: 'A', horario: 'Mar/Jue 10:00-11:30',     estudiantes: 25 },
  { id: 5, nombre: 'Geometría',    grado: '2°',  seccion: 'B', horario: 'Lun/Mié 13:00-14:30',     estudiantes: 29 },
];

const MOCK_HORARIO: HorarioDia[] = [
  { dia: 'Lunes',    bloques: [{ hora: '08:00', materia: 'Matemáticas', grado: '1°A' }, { hora: '10:00', materia: 'Matemáticas', grado: '2°A' }, { hora: '13:00', materia: 'Geometría', grado: '2°B' }] },
  { dia: 'Martes',   bloques: [{ hora: '08:00', materia: 'Matemáticas', grado: '1°B' }, { hora: '10:00', materia: 'Algebra',     grado: '3°A' }] },
  { dia: 'Miércoles',bloques: [{ hora: '08:00', materia: 'Matemáticas', grado: '1°A' }, { hora: '10:00', materia: 'Matemáticas', grado: '2°A' }, { hora: '13:00', materia: 'Geometría', grado: '2°B' }] },
  { dia: 'Jueves',   bloques: [{ hora: '08:00', materia: 'Matemáticas', grado: '1°B' }, { hora: '10:00', materia: 'Algebra',     grado: '3°A' }] },
  { dia: 'Viernes',  bloques: [{ hora: '08:00', materia: 'Matemáticas', grado: '1°A' }, { hora: '10:00', materia: 'Matemáticas', grado: '2°A' }] },
];

@Component({
  selector: 'app-perfilp',
  imports: [FormsModule],
  templateUrl: './perfilp.html',
  styleUrl: './perfilp.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Perfilp {

  // ── Tab activa ──────────────────────────────────────────────────────────
  tabActiva = signal<TabPerfil>('datos');

  // ── Datos del profesor ──────────────────────────────────────────────────
  private _profesor = signal<ProfesorData>({ ...MOCK_PROFESOR });
  materias = signal<MateriaAsignada[]>(MOCK_MATERIAS);
  horario  = signal<HorarioDia[]>(MOCK_HORARIO);

  profesor = computed(() => this._profesor());
  totalEstudiantes = computed(() =>
    this.materias().reduce((acc, m) => acc + m.estudiantes, 0)
  );
  totalHoras = computed(() =>
    this.horario().reduce((acc, d) => acc + d.bloques.length, 0)
  );

  // ── Modo edición ────────────────────────────────────────────────────────
  modoEdicion = signal(false);
  editNombres    = signal('');
  editApellidos  = signal('');
  editCorreo     = signal('');
  editTelefono   = signal('');
  editDireccion  = signal('');

  // ── Foto ────────────────────────────────────────────────────────────────
  fotoPreview    = signal<string>('');
  mostrarPreview = signal(false);

  // ── Password ────────────────────────────────────────────────────────────
  mostrarModalPass = signal(false);
  passActual       = signal('');
  passNueva        = signal('');
  passConfirmar    = signal('');
  verPassActual    = signal(false);
  verPassNueva     = signal(false);
  verPassConfirmar = signal(false);
  passError        = signal('');

  passFortaleza = computed(() => {
    const p = this.passNueva();
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  });

  passFortalezaLabel = computed(() => {
    const s = this.passFortaleza();
    if (s === 0) return '';
    if (s === 1) return 'Débil';
    if (s === 2) return 'Regular';
    if (s === 3) return 'Buena';
    return 'Fuerte';
  });

  passFortalezaClass = computed(() => {
    const s = this.passFortaleza();
    if (s <= 1) return 'debil';
    if (s === 2) return 'regular';
    if (s === 3) return 'buena';
    return 'fuerte';
  });

  // ── Notificaciones ──────────────────────────────────────────────────────
  mensajeExito = signal('');
  mensajeError = signal('');

  // ── Helpers ─────────────────────────────────────────────────────────────
  get iniciales(): string {
    const p = this._profesor();
    return (p.nombres[0] ?? '') + (p.apellidos[0] ?? '');
  }

  get nombreCompleto(): string {
    const p = this._profesor();
    return `${p.nombres} ${p.apellidos}`;
  }

  // ── Tab ─────────────────────────────────────────────────────────────────
  setTab(t: TabPerfil): void {
    this.tabActiva.set(t);
  }

  // ── Edición ─────────────────────────────────────────────────────────────
  iniciarEdicion(): void {
    const p = this._profesor();
    this.editNombres.set(p.nombres);
    this.editApellidos.set(p.apellidos);
    this.editCorreo.set(p.correo);
    this.editTelefono.set(p.telefono);
    this.editDireccion.set(p.direccion);
    this.modoEdicion.set(true);
  }

  cancelarEdicion(): void {
    this.modoEdicion.set(false);
  }

  guardarCambios(): void {
    if (!this.editNombres().trim() || !this.editApellidos().trim() || !this.editCorreo().trim()) {
      this.mensajeError.set('Nombres, Apellidos y Correo son obligatorios.');
      setTimeout(() => this.mensajeError.set(''), 3500);
      return;
    }
    this._profesor.update(p => ({
      ...p,
      nombres:   this.editNombres().trim(),
      apellidos: this.editApellidos().trim(),
      correo:    this.editCorreo().trim(),
      telefono:  this.editTelefono().trim(),
      direccion: this.editDireccion().trim(),
    }));
    this.modoEdicion.set(false);
    this.mensajeExito.set('Datos actualizados correctamente.');
    setTimeout(() => this.mensajeExito.set(''), 3500);
  }

  // ── Foto ─────────────────────────────────────────────────────────────────
  onFotoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      this.mensajeError.set('Solo se permiten imágenes.');
      setTimeout(() => this.mensajeError.set(''), 3000);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      this.fotoPreview.set(e.target?.result as string);
      this.mostrarPreview.set(true);
    };
    reader.readAsDataURL(file);
  }

  confirmarFoto(): void {
    this._profesor.update(p => ({ ...p, foto: this.fotoPreview() }));
    this.mostrarPreview.set(false);
    this.mensajeExito.set('Foto de perfil actualizada.');
    setTimeout(() => this.mensajeExito.set(''), 3000);
  }

  cancelarFoto(): void {
    this.fotoPreview.set('');
    this.mostrarPreview.set(false);
  }

  // ── Contraseña ───────────────────────────────────────────────────────────
  abrirModalPass(): void {
    this.passActual.set('');
    this.passNueva.set('');
    this.passConfirmar.set('');
    this.passError.set('');
    this.verPassActual.set(false);
    this.verPassNueva.set(false);
    this.verPassConfirmar.set(false);
    this.mostrarModalPass.set(true);
  }

  cerrarModalPass(): void {
    this.mostrarModalPass.set(false);
  }

  cambiarPassword(): void {
    if (!this.passActual()) { this.passError.set('Ingresa tu contraseña actual.'); return; }
    if (this.passNueva().length < 8) { this.passError.set('La nueva contraseña debe tener al menos 8 caracteres.'); return; }
    if (this.passNueva() !== this.passConfirmar()) { this.passError.set('Las contraseñas no coinciden.'); return; }
    this.mostrarModalPass.set(false);
    this.mensajeExito.set('Contraseña actualizada correctamente.');
    setTimeout(() => this.mensajeExito.set(''), 3500);
  }

  // ── Utilidades ───────────────────────────────────────────────────────────
  estadoClass(estado: string): string {
    return estado === 'Activo' ? 'badge-activo' : 'badge-inactivo';
  }

  horarioColor(idx: number): string {
    const cols = ['bloque-blue', 'bloque-green', 'bloque-purple', 'bloque-orange', 'bloque-teal'];
    return cols[idx % cols.length];
  }

  formatFecha(fecha: string): string {
    const [y, m, d] = fecha.split('-');
    const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    return `${d} ${meses[parseInt(m) - 1]} ${y}`;
  }
}

