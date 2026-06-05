import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
export interface EstudianteCalif {
  id: number;
  nombre: string;
  notas: (number | null)[];
  observacion: string;
}

export interface PreguntaEstructura {
  id: number;
  tipo: 'desarrollo' | 'opcion' | 'vf';
  tipoEtiqueta: string;
  puntos: number;
  texto: string;
}

@Component({
  selector: 'app-gestion-evaluaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './evaluacion.html', // O inserta el HTML directo
  styleUrls: ['evaluacion.css']
})
export class GestionEvaluacionesComponent {
  
  // Estado de la pestaña activa (Tab 0 por defecto)
  tabActiva = signal<number>(0);
  
  // Chip de filtro seleccionado
  chipSeleccionado = signal<string>('Todas');

  // Estado del Toast
  toastMsg = signal<string>('OK');
  toastType = signal<string>('ok');
  toastVisible = signal<boolean>(false);
  private toastTimeout: any;

  // Lista de preguntas dinámicas iniciales (Tab 2)
  preguntas = signal<PreguntaEstructura[]>([
    { id: 1, tipo: 'desarrollo', tipoEtiqueta: 'Desarrollo', puntos: 4, texto: 'Resuelve el sistema de ecuaciones: 2x + 3y = 12 ; x - y = 1' },
    { id: 2, tipo: 'opcion', tipoEtiqueta: 'Opción múltiple', puntos: 2, texto: '¿Cuál es el vértice de la parábola y = x² - 4x + 3?' },
    { id: 3, tipo: 'vf', tipoEtiqueta: 'Verdadero/Falso', puntos: 2, texto: 'Toda función cuadrática tiene exactamente dos raíces reales.' }
  ]);

  // Lista de estudiantes cargados para calificar (Tab 3)
  estudiantes = signal<EstudianteCalif[]>([]);

  private NAMES = [
    'Aguirre López, Pedro', 'Álvarez Quispe, María', 'Benites Ruiz, Ana', 
    'Campos Torres, Luis', 'Castillo Vega, Rosa', 'Chávez Díaz, Jorge', 
    'Cruz Mendoza, Lucía', 'Delgado Ramos, Carlos', 'Espinoza Paredes, Sofía', 
    'Fernández León, Diego', 'García Huamán, Andrea', 'Gómez Salazar, Kevin', 
    'Gutiérrez Flores, Valeria', 'Herrera Sánchez, Marco', 'Huamán Rivera, Carmen', 
    'López Castro, Daniel'
  ];

  // Cambiar de pestaña y gatillar acciones como la construcción de la tabla
  cambiarTab(idx: number): void {
    this.tabActiva.set(idx);
    if (idx === 2) {
      this.inicializarTablaCalificaciones();
    }
  }

  cambiarChip(tipo: string): void {
    this.chipSeleccionado.set(tipo);
  }

  /* GESTIÓN DE PREGUNTAS (TAB 2) */
  agregarPregunta(tipo: 'desarrollo' | 'opcion' | 'vf'): void {
    const mapeoTipos = { desarrollo: 'Desarrollo', opcion: 'Opción múltiple', vf: 'Verdadero/Falso' };
    
    const nuevaPregunta: PreguntaEstructura = {
      id: this.preguntas().length + 1,
      tipo,
      tipoEtiqueta: mapeoTipos[tipo],
      puntos: 2,
      texto: 'Escribe la pregunta aquí...'
    };

    this.preguntas.update(prev => [...prev, nuevaPregunta]);
    this.mostrarToast('Pregunta agregada', 'info');
  }

  eliminarPregunta(index: number): void {
    this.preguntas.update(prev => {
      const filtradas = prev.filter((_, i) => i !== index);
      // Re-indexación automática usando el índice del arreglo
      return filtradas.map((preg, idx) => ({ ...preg, id: idx + 1 }));
    });
  }

  /* SISTEMA DE CALIFICACIONES (TAB 3) */
  inicializarTablaCalificaciones(): void {
    if (this.estudiantes().length > 0) return; // Evita sobreescritura si ya fue cargada

    const listaInicial = this.NAMES.map((name, i) => ({
      id: i + 1,
      nombre: name,
      notas: [null, null, null, null, null], // 5 inputs de notas por defecto
      observacion: ''
    }));
    
    this.estudiantes.set(listaInicial);
  }

  // Valida los rangos numéricos al escribir y actualiza el arreglo reactivo
  actualizarNota(estudianteIdx: number, notaIdx: number, event: Event, maxPuntos: number): void {
    const input = event.target as HTMLInputElement;
    let valor: number | null = input.value === '' ? null : parseInt(input.value, 10);

    if (valor !== null) {
      if (valor > maxPuntos) { valor = maxPuntos; input.value = maxPuntos.toString(); }
      if (valor < 0) { valor = 0; input.value = '0'; }
    }

    this.estudiantes.update(prev => {
      const actualizados = [...prev];
      actualizados[estudianteIdx].notas[notaIdx] = valor;
      return actualizados;
    });
  }

  // Retorna la clase CSS del input basándose en el porcentaje obtenido
  obtenerClaseNota(nota: number | null, maxPuntos: number): string {
    if (nota === null) return '';
    if (nota >= maxPuntos * 0.75) return 'high';
    if (nota >= maxPuntos * 0.5) return 'mid';
    return 'low';
  }

  // Calcula la suma total de las celdas de un estudiante
  calcularSumaTotal(notas: (number | null)[]): string | number {
    const notasFiltradas = notas.filter((n): n is number => n !== null);
    if (notasFiltradas.length === 0) return '—';
    return notasFiltradas.reduce((a, b) => a + b, 0);
  }

  // Retorna el color CSS para la columna total (escala vigesimal estándar peruana)
  obtenerColorTotal(notas: (number | null)[]): string {
    const total = this.calcularSumaTotal(notas);
    if (total === '—') return 'var(--g4)';
    const n = total as number;
    return n >= 13 ? 'var(--ok)' : n >= 11 ? 'var(--wa)' : 'var(--er)';
  }

  /* TOAST IMPLEMENTATION */
  mostrarToast(msg: string, type: 'ok' | 'info' | 'warn' | 'er' = 'ok'): void {
    clearTimeout(this.toastTimeout);
    this.toastMsg.set(msg);
    this.toastType.set(type);
    this.toastVisible.set(true);

    this.toastTimeout = setTimeout(() => {
      this.toastVisible.set(false);
    }, 3200);
  }
}