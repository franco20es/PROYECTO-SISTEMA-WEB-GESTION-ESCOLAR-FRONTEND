import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';


export type EstadoMatricula = 'activo' | 'inactivo' | 'egresado' | 'suspendido';
export type Genero = 'M' | 'F';
 
export interface Estudiante {
  id: number;
  codigo: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  genero: Genero;
  fechaNacimiento: string;
  carrera: string;
  ciclo: number;
  seccion: string;
  turno: 'mañana' | 'tarde' | 'noche';
  estado: EstadoMatricula;
  promedio: number;
  asistencia: number;
  fechaIngreso: string;
  dni: string;
  avatar: string; // iniciales color hex
}
 
// ── Generador de datos mock ──────────────────────────────
const NOMBRES_M = ['Carlos','José','Luis','Miguel','Diego','Andrés','Pedro','Alejandro','Sebastián','Ricardo','Eduardo','Fernando','Manuel','Jorge','David','Mateo','Rodrigo','Álvaro','Iván','Víctor'];
const NOMBRES_F = ['María','Ana','Lucía','Sofía','Isabella','Valentina','Camila','Daniela','Gabriela','Paula','Fernanda','Andrea','Paola','Natalia','Valeria','Claudia','Patricia','Mónica','Diana','Sandra'];
const APELLIDOS = ['García','Rodríguez','Martínez','López','González','Torres','Flores','Ríos','Sánchez','Ruiz','Morales','Jiménez','Vega','Castillo','Romero','Vargas','Cruz','Herrera','Navarro','Ortiz','Salas','Paredes','Mendoza','Guzmán','Ramos'];
const CARRERAS = ['Ingeniería de Sistemas','Ingeniería Civil','Administración','Contabilidad','Derecho','Medicina','Enfermería','Arquitectura'];
const SECCIONES = ['A','B','C','D'];
const TURNOS: ('mañana'|'tarde'|'noche')[] = ['mañana','tarde','noche'];
const ESTADOS: EstadoMatricula[] = ['activo','activo','activo','activo','inactivo','egresado','suspendido'];
const AVATAR_COLORS = ['#007AFF','#0056CC','#1a7f5a','#b45309','#6d28d9','#0891b2','#be123c','#15803d'];
 
function rng(seed: number): number {
  let x = Math.sin(seed + 1) * 43758.5453;
  return x - Math.floor(x);
}
 
function generarEstudiantes(n: number): Estudiante[] {
  return Array.from({ length: n }, (_, i) => {
    const s = i + 7;
    const esF = rng(s * 3) > 0.5;
    const nombres = (esF ? NOMBRES_F : NOMBRES_M)[Math.floor(rng(s) * (esF ? NOMBRES_F : NOMBRES_M).length)];
    const apellido1 = APELLIDOS[Math.floor(rng(s + 1) * APELLIDOS.length)];
    const apellido2 = APELLIDOS[Math.floor(rng(s + 5) * APELLIDOS.length)];
    const carrera = CARRERAS[Math.floor(rng(s + 2) * CARRERAS.length)];
    const ciclo = Math.floor(rng(s + 3) * 10) + 1;
    const año = 2019 + Math.floor(rng(s + 9) * 5);
    const prom = Math.round((10 + rng(s + 4) * 10) * 10) / 10;
 
    return {
      id: i + 1,
      codigo: `${año.toString().slice(2)}${String(Math.floor(rng(s + 6) * 9000) + 1000)}`,
      nombres,
      apellidos: `${apellido1} ${apellido2}`,
      email: `${nombres.toLowerCase().replace(/á|é|í|ó|ú/g,'a')}.${apellido1.toLowerCase()}@educampus.edu.pe`,
      telefono: `9${String(Math.floor(rng(s + 7) * 90000000) + 10000000)}`,
      genero: esF ? 'F' : 'M',
      fechaNacimiento: `${2000 + Math.floor(rng(s+11)*5)}-${String(Math.floor(rng(s+12)*12)+1).padStart(2,'0')}-${String(Math.floor(rng(s+13)*28)+1).padStart(2,'0')}`,
      carrera,
      ciclo,
      seccion: SECCIONES[Math.floor(rng(s + 8) * SECCIONES.length)],
      turno: TURNOS[Math.floor(rng(s + 10) * TURNOS.length)],
      estado: ESTADOS[Math.floor(rng(s + 11) * ESTADOS.length)],
      promedio: prom,
      asistencia: Math.round(55 + rng(s + 12) * 45),
      fechaIngreso: `${año}-03-01`,
      dni: String(Math.floor(rng(s + 13) * 90000000) + 10000000),
      avatar: AVATAR_COLORS[i % AVATAR_COLORS.length],
    };
  });
}
 
const TODOS_LOS_ESTUDIANTES: Estudiante[] = generarEstudiantes(120);
@Component({
  selector: 'app-alumnos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alumnos.html',
  styleUrl: './alumnos.css',
})
export class Alumnos {
  
  // ── Datos ──────────────────────────────────────────────
  todos: Estudiante[] = TODOS_LOS_ESTUDIANTES;
 
  // ── Filtros ────────────────────────────────────────────
  busqueda       = '';
  filtroCodigo   = '';
  filtroCarrera  = '';
  filtroSeccion  = '';
  filtroTurno    = '';
  filtroEstado   = '';
  filtroCiclo    = '';
 
  // ── Paginación ─────────────────────────────────────────
  paginaActual = 1;
  porPagina    = 15;
  opcionesPorPagina = [10, 15, 25, 50];
 
  // ── Vista ──────────────────────────────────────────────
  vistaTabla = true;   // false = tarjetas
  ordenCampo: keyof Estudiante = 'apellidos';
  ordenAsc = true;
 
  // ── Modal ──────────────────────────────────────────────
  estudianteModal: Estudiante | null = null;
  modoFormulario: 'nuevo' | 'editar' | null = null;
  formData: Partial<Estudiante> = {};
  mostrarConfirmEliminar = false;
  estudianteAEliminar: Estudiante | null = null;
 
  // ── Selección múltiple ─────────────────────────────────
  seleccionados = new Set<number>();
  todosMarcados = false;
 
  // ── Catálogos ──────────────────────────────────────────
  readonly carreras  = CARRERAS;
  readonly secciones = SECCIONES;
  readonly turnos    = TURNOS;
  readonly estados: EstadoMatricula[] = ['activo','inactivo','egresado','suspendido'];
  readonly ciclos    = [1,2,3,4,5,6,7,8,9,10];
 
  // ── Computed ───────────────────────────────────────────
  get filtrados(): Estudiante[] {
    const q = this.busqueda.toLowerCase().trim();
    return this.todos
      .filter(e => {
        const matchQ = !q ||
          e.nombres.toLowerCase().includes(q) ||
          e.apellidos.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.codigo.includes(q) ||
          e.dni.includes(q);
        const matchCod    = !this.filtroCodigo   || e.codigo.includes(this.filtroCodigo);
        const matchCarr   = !this.filtroCarrera  || e.carrera === this.filtroCarrera;
        const matchSecc   = !this.filtroSeccion  || e.seccion === this.filtroSeccion;
        const matchTurno  = !this.filtroTurno    || e.turno === this.filtroTurno;
        const matchEst    = !this.filtroEstado   || e.estado === this.filtroEstado;
        const matchCiclo  = !this.filtroCiclo    || e.ciclo === +this.filtroCiclo;
        return matchQ && matchCod && matchCarr && matchSecc && matchTurno && matchEst && matchCiclo;
      })
      .sort((a, b) => {
        const va = a[this.ordenCampo] as string | number;
        const vb = b[this.ordenCampo] as string | number;
        return this.ordenAsc
          ? String(va).localeCompare(String(vb), undefined, { numeric: true })
          : String(vb).localeCompare(String(va), undefined, { numeric: true });
      });
  }
 
  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.filtrados.length / this.porPagina));
  }
 
  get pagina(): Estudiante[] {
    const ini = (this.paginaActual - 1) * this.porPagina;
    return this.filtrados.slice(ini, ini + this.porPagina);
  }
 
  get paginas(): number[] {
    const total = this.totalPaginas;
    const actual = this.paginaActual;
    const rango: number[] = [];
    for (let i = Math.max(1, actual - 2); i <= Math.min(total, actual + 2); i++) {
      rango.push(i);
    }
    return rango;
  }
 
  // ── KPIs ───────────────────────────────────────────────
  get kpiActivos():      number { return this.todos.filter(e => e.estado === 'activo').length; }
  get kpiInactivos():    number { return this.todos.filter(e => e.estado === 'inactivo').length; }
  get kpiEgresados():    number { return this.todos.filter(e => e.estado === 'egresado').length; }
  get kpiSuspendidos():  number { return this.todos.filter(e => e.estado === 'suspendido').length; }
  get kpiPromGlobal():   string {
    const p = this.todos.filter(e=>e.estado==='activo').reduce((a,e)=>a+e.promedio,0);
    return (p / (this.kpiActivos || 1)).toFixed(1);
  }
 
  // ── Lifecycle ──────────────────────────────────────────
  ngOnInit(): void {}
 
  // ── Ordenamiento ───────────────────────────────────────
  ordenar(campo: keyof Estudiante): void {
    if (this.ordenCampo === campo) this.ordenAsc = !this.ordenAsc;
    else { this.ordenCampo = campo; this.ordenAsc = true; }
    this.irPagina(1);
  }
 
  // ── Paginación ─────────────────────────────────────────
  irPagina(p: number): void {
    this.paginaActual = Math.max(1, Math.min(p, this.totalPaginas));
  }
 
  onFiltroChange(): void { this.paginaActual = 1; this.seleccionados.clear(); }
 
  limpiarFiltros(): void {
    this.busqueda = this.filtroCodigo = this.filtroCarrera =
    this.filtroSeccion = this.filtroTurno = this.filtroEstado = this.filtroCiclo = '';
    this.paginaActual = 1;
    this.seleccionados.clear();
  }
 
  get hayFiltros(): boolean {
    return !!(this.busqueda || this.filtroCodigo || this.filtroCarrera ||
              this.filtroSeccion || this.filtroTurno || this.filtroEstado || this.filtroCiclo);
  }
 
  // ── Selección ──────────────────────────────────────────
  toggleSeleccion(id: number): void {
    this.seleccionados.has(id) ? this.seleccionados.delete(id) : this.seleccionados.add(id);
    this.todosMarcados = this.pagina.every(e => this.seleccionados.has(e.id));
  }
 
  toggleTodos(): void {
    this.todosMarcados = !this.todosMarcados;
    if (this.todosMarcados) this.pagina.forEach(e => this.seleccionados.add(e.id));
    else this.pagina.forEach(e => this.seleccionados.delete(e.id));
  }
 
  estaSeleccionado(id: number): boolean { return this.seleccionados.has(id); }
 
  // ── Modal ver ──────────────────────────────────────────
  verEstudiante(e: Estudiante): void { this.estudianteModal = e; }
  cerrarModal(): void { this.estudianteModal = null; }
 
  // ── Formulario nuevo/editar ────────────────────────────
  abrirNuevo(): void {
    this.formData = { estado: 'activo', genero: 'M', turno: 'mañana', seccion: 'A', ciclo: 1 };
    this.modoFormulario = 'nuevo';
  }
 
  abrirEditar(e: Estudiante): void {
    this.formData = { ...e };
    this.modoFormulario = 'editar';
    this.estudianteModal = null;
  }
 
  guardarFormulario(): void {
    if (this.modoFormulario === 'nuevo') {
      const nuevo: Estudiante = {
        ...this.formData as Estudiante,
        id: Date.now(),
        codigo: `25${String(Math.floor(Math.random()*9000)+1000)}`,
        avatar: AVATAR_COLORS[this.todos.length % AVATAR_COLORS.length],
        promedio: 0, asistencia: 0,
        fechaIngreso: new Date().toISOString().split('T')[0],
      };
      this.todos = [nuevo, ...this.todos];
    } else {
      this.todos = this.todos.map(e => e.id === this.formData.id ? { ...e, ...this.formData } as Estudiante : e);
    }
    this.modoFormulario = null;
  }
 
  cancelarFormulario(): void { this.modoFormulario = null; }
 
  // ── Eliminar ───────────────────────────────────────────
  confirmarEliminar(e: Estudiante): void {
    this.estudianteAEliminar = e;
    this.mostrarConfirmEliminar = true;
    this.estudianteModal = null;
  }
 
  ejecutarEliminar(): void {
    if (this.estudianteAEliminar) {
      this.todos = this.todos.filter(e => e.id !== this.estudianteAEliminar!.id);
      this.seleccionados.delete(this.estudianteAEliminar.id);
    }
    this.mostrarConfirmEliminar = false;
    this.estudianteAEliminar = null;
  }
 
  eliminarSeleccionados(): void {
    this.todos = this.todos.filter(e => !this.seleccionados.has(e.id));
    this.seleccionados.clear();
    this.todosMarcados = false;
  }
 
  // ── Helpers UI ─────────────────────────────────────────
  iniciales(e: Estudiante): string { return e.nombres[0] + e.apellidos[0]; }
 
  estadoClass(est: string): string {
    return { activo:'est-activo', inactivo:'est-inactivo', egresado:'est-egresado', suspendido:'est-suspendido' }[est] ?? '';
  }
 
  notaClass(n: number): string { return n>=14?'np-good':n>=11?'np-mid':'np-bad'; }
  asistColor(n: number): string { return n>=80?'#16a34a':n>=65?'#e65100':'#dc2626'; }
 
  ordenIcon(campo: keyof Estudiante): string {
    if (this.ordenCampo !== campo) return '⇅';
    return this.ordenAsc ? '↑' : '↓';
  }
 
  get inicioReg(): number { return (this.paginaActual - 1) * this.porPagina + 1; }
  get finReg():    number { return Math.min(this.paginaActual * this.porPagina, this.filtrados.length); }

}
