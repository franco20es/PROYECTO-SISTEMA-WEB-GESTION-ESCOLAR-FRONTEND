import { CommonModule, DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Toast } from '../../../../../core/components/toast/toast/toast';
import { ToastService } from '../../../../../core/services/toast/toast.service'; 

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [CommonModule, Toast],
  templateUrl: './cursos.html',
  styleUrl: './cursos.css',
})
export class CursosAlumno {

  // Estado
  selectedCourse: any = null;
  activeTab: string = 'resumen';
  expandedTasks: Set<string> = new Set();
  showModalEntrega = false;
  showModalForo = false;
  modalTareaTitle = '';
  modalTareaCurso = '';

  constructor(
    private toastService: ToastService,
    private router: Router
  ) {}

  showToast(msg: string, type: string = 'info') {
    this.toastService.show(msg, type);
  }

  // Abrir/cerrar curso (TOGGLE)
  onOpenCourse(course: any) {
    if (this.selectedCourse?.id === course.id) {
      this.selectedCourse = null;
    } else {
      this.selectedCourse = course;
      this.activeTab = 'resumen';
      this.expandedTasks.clear();
    }
  }





  // Array de cursos CON DATOS COMPLETOS
  courses = [
    {
      id: 'mat',
      nombre: 'Matemática',
      profesor: 'Prof. Roberto Meza',
      teacher: 'Prof. Roberto Meza',
      horario: 'Lun, Mié, Vie · 8:00 – 8:45 am',
      aula: 'Aula 203 · Bloque B',
      color: '#2A63E6',
      nota: 15.5,
      notaClass: 'nota-b',
      progreso: 77,
      svgPath: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z',
      b1: '15', b2: '17', b3: '—', b4: '—', prom: '15.5', promClass: 'nota-b',
      tags: [
        { text: '1 tarea pendiente', class: 'ct-pend' },
        { text: 'Examen B2 hoy', class: 'ct-ok' }
      ],
      resumen: {
        anuncios: [
          { date: '08 May', color: '#FF5B1F', bg: 'rgba(255,91,31,.04)', title: '📢 Examen B2 hoy — ¡Ánimo!', text: 'El examen del segundo bimestre es hoy. Temas: fracciones equivalentes, decimales y estadística básica. Traer compás y regla.' },
          { date: '02 May', color: '#2A63E6', bg: 'rgba(42,99,230,.04)', title: '📋 Tarea: Ejercicios de fracciones', text: 'Entregar ejercicios págs. 84–86 antes del viernes. En físico con procedimiento completo.' }
        ],
        logros: [
          { text: 'Resuelve problemas de cantidad: fracciones y decimales', ok: true },
          { text: 'Gestiona datos e incertidumbre con gráficos estadísticos', ok: true },
          { text: 'Resuelve problemas de regularidad, equivalencia y cambio', ok: false }
        ]
      },
      tareas: [
        { id: 'mat-t1', titulo: 'Ejercicios de Fracciones Equivalentes — Págs. 84–86', fecha: 'Vie 09 May 2025', estado: 'pend', valor: '4 pts', desc: 'Resolver los ejercicios de fracciones equivalentes de las páginas 84, 85 y 86 del libro de Matemática 5°. Mostrar procedimiento completo.' },
        { id: 'mat-t2', titulo: 'Mapa Mental: Números Decimales y Operaciones', fecha: '24 Abr 2025', estado: 'ok', nota: '18', valor: '5 pts', desc: 'Elaborar un mapa mental creativo sobre los números decimales.', feedback: '"Excelente trabajo Sofía. El mapa mental está muy completo y creativo."' }
      ],
      evaluaciones: {
        proxima: { titulo: 'Examen Bimestre 2 — Fracciones y Decimales', fecha: '08 May 2025', hora: '8:00 am', temas: 'Fracciones equivalentes · Decimales · Estadística básica' },
        historial: [
          { nombre: 'Práctica N°1 — Números naturales', tipo: 'prac', fecha: '15 Mar', nota: '18', obs: 'Excelente' },
          { nombre: 'Examen Bimestre 1', tipo: 'exam', fecha: '28 Mar', nota: '15', obs: 'Revisar problemas aplicados' }
        ],
        b1: '15', b2: '17', b3: '—', prom: '17.4'
      },
      material: {
        docs: [
          { tipo: 'pdf', nombre: 'Sesión 01 — Fracciones equivalentes.pdf', sub: 'Prof. Roberto Meza · 15 Mar 2025', size: '2.4 MB' },
          { tipo: 'pdf', nombre: 'Sesión 02 — Números decimales.pdf', sub: 'Prof. Roberto Meza · 22 Mar 2025', size: '3.1 MB' }
        ],
        videos: [
          { tipo: 'vid', nombre: 'Video: Cómo resolver problemas con fracciones — 15 min', sub: 'YouTube · Canal Matemática Fácil 5°', size: 'Externo' }
        ]
      },
      foro: [
        { av: 'RM', avColor: 'linear-gradient(135deg,#0A1A3E,#1340A0)', autor: 'Prof. Roberto Meza', rol: 'Docente de Matemática', time: '08 May · 07:30', pin: true, titulo: '📢 Recordatorio: Examen B2 hoy jueves 08 de mayo', texto: 'Estimados alumnos, el examen de hoy cubrirá: fracciones equivalentes, operaciones con decimales...', likes: 12, replies: [] }
      ]
    },
    {
      id: 'com',
      nombre: 'Comunicación',
      profesor: 'Lic. Lucía Paredes',
      teacher: 'Lic. Lucía Paredes',
      horario: 'Mar, Jue · 8:45 – 10:15 am',
      aula: 'Aula 201 · Bloque A',
      color: '#FF5B1F',
      nota: 18.0,
      notaClass: 'nota-a',
      progreso: 90,
      svgPath: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z',
      b1: '18', b2: '17', b3: '—', b4: '—', prom: '18.0', promClass: 'nota-a',
      tags: [
        { text: 'Todas entregadas', class: 'ct-entregada' }
      ],
      resumen: { anuncios: [], logros: [] },
      tareas: [
        { id: 'com-t1', titulo: 'Resumen: "El Principito" — Capítulos 1 al 10', fecha: 'Vie 02 May 2025', estado: 'ok', nota: '19', valor: '5 pts', desc: 'Elaborar un resumen de 2 páginas de los primeros 10 capítulos.' }
      ],
      evaluaciones: { proxima: { titulo: 'Exposición Oral', fecha: '15 May 2025', hora: '9:00 am', temas: 'Resumen del libro' }, historial: [], b1: '18', b2: '17', b3: '—', prom: '18.5' },
      material: { docs: [], videos: [] },
      foro: []
    },
    {
      id: 'cie',
      nombre: 'Ciencias Naturales',
      profesor: 'Prof. Sandra Chávez',
      teacher: 'Prof. Sandra Chávez',
      horario: 'Lun, Mié · 10:15 – 11:00 am',
      aula: 'Aula 105 · Lab. Ciencias',
      color: '#00C27C',
      nota: 13.3,
      notaClass: 'nota-c',
      progreso: 66,
      svgPath: 'M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8z',
      b1: '14', b2: '15', b3: '—', b4: '—', prom: '13.3', promClass: 'nota-c',
      tags: [
        { text: '1 tarea pendiente', class: 'ct-pend' },
        { text: '1 vencida', class: 'ct-vencida' }
      ],
      resumen: { anuncios: [], logros: [] },
      tareas: [],
      evaluaciones: { proxima: { titulo: 'Práctica de laboratorio', fecha: '12 May 2025', hora: '10:15 am', temas: 'Ciclo del agua' }, historial: [], b1: '14', b2: '15', b3: '—', prom: '14.8' },
      material: { docs: [], videos: [] },
      foro: []
    },
    {
      id: 'his',
      nombre: 'Historia y Geografía',
      profesor: 'Mg. Jorge Vargas',
      teacher: 'Mg. Jorge Vargas',
      horario: 'Mar, Jue · 11:00 – 11:45 am',
      aula: 'Aula 204 · Bloque B',
      color: '#F5A623',
      nota: 15.5,
      notaClass: 'nota-b',
      progreso: 77,
      svgPath: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
      b1: '16', b2: '15', b3: '—', b4: '—', prom: '15.5', promClass: 'nota-b',
      tags: [
        { text: 'Todas entregadas', class: 'ct-entregada' }
      ],
      resumen: { anuncios: [], logros: [] },
      tareas: [],
      evaluaciones: { proxima: { titulo: 'Examen Bimestre 2', fecha: '21 May 2025', hora: '11:00 am', temas: 'Imperio Inca · Conquista' }, historial: [], b1: '16', b2: '15', b3: '—', prom: '15.8' },
      material: { docs: [], videos: [] },
      foro: []
    },
    {
      id: 'ing',
      nombre: 'Inglés',
      profesor: 'Prof. Karen Solís',
      teacher: 'Prof. Karen Solís',
      horario: 'Lun, Vie · 12:00 – 12:45 pm',
      aula: 'Aula 202 · Bloque A',
      color: '#9B59B6',
      nota: 17.0,
      notaClass: 'nota-a',
      progreso: 85,
      svgPath: 'M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z',
      b1: '17', b2: '17', b3: '—', b4: '—', prom: '17.0', promClass: 'nota-a',
      tags: [
        { text: '1 tarea pendiente', class: 'ct-pend' }
      ],
      resumen: { anuncios: [], logros: [] },
      tareas: [],
      evaluaciones: { proxima: { titulo: 'Speaking Test', fecha: '19 May 2025', hora: '12:00 pm', temas: 'Present simple · Vocabulary' }, historial: [], b1: '17', b2: '17', b3: '—', prom: '17.0' },
      material: { docs: [], videos: [] },
      foro: []
    },
    {
      id: 'ef',
      nombre: 'Educación Física',
      profesor: 'Prof. Miguel Ramos',
      teacher: 'Prof. Miguel Ramos',
      horario: 'Mié, Vie · 1:00 – 1:45 pm',
      aula: 'Patio / Coliseo',
      color: '#1ABC9C',
      nota: 16.8,
      notaClass: 'nota-a',
      progreso: 84,
      svgPath: 'M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z',
      b1: '16', b2: '17', b3: '—', b4: '—', prom: '16.8', promClass: 'nota-a',
      tags: [
        { text: 'Al día', class: 'ct-entregada' }
      ],
      resumen: { anuncios: [], logros: [] },
      tareas: [],
      evaluaciones: { proxima: { titulo: 'Semana de Atletismo', fecha: '12-16 May 2025', hora: '1:00 pm', temas: '100m planos · 800m resistencia' }, historial: [], b1: '16', b2: '17', b3: '—', prom: '17.0' },
      material: { docs: [], videos: [] },
      foro: []
    }
  ];
}


  

