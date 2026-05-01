import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
export interface Evaluacion {
  nombre: string;
  nota: number | null;
  peso: number;
}
 
export interface Curso {
  id: number;
  nombre: string;
  abrev: string;
  codigo: string;
  profesor: string;
  creditos: number;
  nota: number;
  asistencia: number;
  progreso: number;
  horario: string;
  evaluacionesDetalle: Evaluacion[];
}
 
export interface Recurso {
  tipo: 'video' | 'doc' | 'task' | 'quiz';
  nombre: string;
  meta: string;
  done: boolean;
  nota: number | null;
}
 
export interface Semana {
  n: number;
  tema: string;
  done: boolean;
  current: boolean;
  locked: boolean;
  recursos: Recurso[];
  abierta: boolean;
}
 
const TEMAS: Record<number, string[]> = {
  1: ['Intro a HTML5 y CSS3','Layouts con Flexbox y Grid','JavaScript ES6+','DOM y eventos','Fetch API y REST','Intro a React','Componentes y props','State y efectos','React Router','Formularios reactivos','Autenticación JWT','Deploy y CI/CD','Testing unitario','Accesibilidad web','Rendimiento y optimización','GraphQL básico','Proyecto final (parte 1)','Proyecto final (parte 2)'],
  2: ['Intro a bases de datos','Modelo E-R','SQL: DDL y DML','Consultas avanzadas','Joins y subconsultas','Índices y vistas','Transacciones ACID','Procedimientos almacenados','Triggers','NoSQL: MongoDB','Sharding y replicación','Optimización de queries','Backup y recuperación','Seguridad en BD','ORM con Hibernate','Caché y Redis','Proyecto BD (diseño)','Proyecto BD (implementación)'],
  3: ['Modelos OSI y TCP/IP','Ethernet y WiFi','IP y subnetting','Routing básico','OSPF y BGP','DNS y DHCP','HTTP/HTTPS','Firewalls y NAT','VPN y tunneling','Redes SDN','IPv6','Monitoreo de redes','Seguridad perimetral','Switching avanzado','QoS','Redes inalámbricas avanzadas','Proyecto redes (diseño)','Proyecto redes (presentación)'],
  4: ['Repaso cálculo diferencial','Límites y continuidad','Derivadas','Regla de la cadena','Optimización','Integrales indefinidas','Integrales definidas','Técnicas de integración','Series y sucesiones','Series de Taylor','EDO de primer orden','EDO de segundo orden','Sistemas de EDO','Transformada de Laplace','Ecuaciones diferenciales parciales','Métodos numéricos','Proyecto matemático','Presentación final'],
  5: ['Intro a IA y ML','Regresión lineal','Regresión logística','KNN y árboles','Random Forests','SVM','Redes neuronales básicas','Backpropagation','CNN','RNN y LSTM','Transfer Learning','NLP básico','Embeddings','Transformers y atención','Reinforcement Learning','MLOps','Proyecto ML (datos)','Proyecto ML (modelo)'],
  6: ['Ética y profesionalismo','Códigos deontológicos','Responsabilidad social','Propiedad intelectual','Privacidad y datos','Ética en IA','Casos de estudio 1','Dilemas éticos','Ética empresarial','Corrupción y transparencia','Marco legal TIC','Ciberseguridad ética','Ética en investigación','Medio ambiente y tecnología','Casos de estudio 2','Ética global','Proyecto ético','Presentación final'],
};
@Component({
  selector: 'app-detalle-cursos',
   standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-cursos.html',
  styleUrl: './detalle-cursos.css',
})
export class DetalleCursos  {
curso: Curso | null = null;
constructor(private route: ActivatedRoute) {}

 
  semanas: Semana[] = [];
  semanasCompletadas = 0;
 
  ngOnInit(): void {
  const id = Number(this.route.snapshot.paramMap.get('id'));

  // ⚠️ SIMULACIÓN (luego será service)
  this.curso = this.getCursoById(id);

  if (this.curso) {
    this.buildSemanas();
  }
}
 
  buildSemanas(): void {
    if (!this.curso) return;
    const temas = TEMAS[this.curso.id] ?? Array.from({ length: 18 }, (_, i) => `Tema ${i + 1}`);
    this.semanasCompletadas = Math.floor(18 * this.curso.progreso / 100);
 
    this.semanas = temas.map((tema, i) => {
      const n = i + 1;
      const done = n <= this.semanasCompletadas;
      const current = n === this.semanasCompletadas + 1;
 
      const recursos: Recurso[] = [
        { tipo: 'video', nombre: `Clase ${n}: ${tema}`, meta: 'Video · 45 min', done, nota: null },
        { tipo: 'doc',   nombre: `Lectura: ${tema}`,    meta: 'PDF · 10 páginas', done, nota: null },
      ];
 
      if (n % 3 === 0) {
        recursos.push({
          tipo: 'task',
          nombre: `Tarea ${Math.ceil(n / 3)}`,
          meta: 'Entrega · 7 días',
          done: done && n < this.semanasCompletadas,
          nota: done ? this.randomNota(13, 5) : null,
        });
      }
 
      if (n % 6 === 0) {
        recursos.push({
          tipo: 'quiz',
          nombre: `Quiz semana ${n}`,
          meta: 'Quiz · 20 min',
          done: done && n < this.semanasCompletadas,
          nota: done ? this.randomNota(12, 6) : null,
        });
      }
 
      return { n, tema, done, current, locked: !done && !current, recursos, abierta: false };
    });
  }
 
  toggleSemana(semana: Semana): void {
    semana.abierta = !semana.abierta;
  }
 
  tieneTarea(semana: Semana): boolean {
    return semana.recursos.some(r => r.tipo === 'task');
  }
 
  tieneQuiz(semana: Semana): boolean {
    return semana.recursos.some(r => r.tipo === 'quiz');
  }
 
  notaClass(nota: number): string {
    if (nota >= 14) return 'good';
    if (nota >= 11) return 'mid';
    return 'bad';
  }
 
  notaColorClass(nota: number): string {
    if (nota >= 14) return 'green';
    if (nota >= 11) return 'orange';
    return 'red';
  }
 
  iconoRecurso(tipo: string): string {
    const map: Record<string, string> = { video: '▶', doc: '📄', task: '✏', quiz: '📝' };
    return map[tipo] ?? '•';
  }
 
  private randomNota(base: number, range: number): number {
    return Math.round(base + Math.random() * range);
  }
  getCursoById(id: number): Curso | null {
  const cursos: Curso[] = [
    {
      id: 1,
      nombre: 'Desarrollo Web',
      codigo: 'CS401',
      profesor: 'Dr. López',
      creditos: 4,
      nota: 16.5,
      asistencia: 90,
      progreso: 70,
      horario: 'Lun/Mié 08:00-10:00',
      abrev: 'DW',
      evaluacionesDetalle: []
    },
    {
      id: 2,
      nombre: 'Base de Datos',
      codigo: 'CS402',
      profesor: 'Mg. Ríos',
      creditos: 3,
      nota: 14,
      asistencia: 75,
      progreso: 55,
      horario: 'Mar/Jue 10:30-12:00',
      abrev: 'BD',
      evaluacionesDetalle: []
    },
    {
      id: 3,
      nombre: 'Redes',
      codigo: 'CS403',
      profesor: 'Ing. Torres',
      creditos: 3,
      nota: 11.5,
      asistencia: 68,
      progreso: 45,
      horario: 'Vie 14:00-17:00',
      abrev: 'RED',
      evaluacionesDetalle: []
    },
    {
      id: 4,
      nombre: 'Matemática III',
      codigo: 'MAT201',
      profesor: 'Dr. Vargas',
      creditos: 4,
      nota: 17,
      asistencia: 95,
      progreso: 80,
      horario: 'Lun/Mar/Jue 07:00-08:00',
      abrev: 'MAT',
      evaluacionesDetalle: []
    },
    {
      id: 5,
      nombre: 'IA y Machine Learning',
      codigo: 'CS501',
      profesor: 'Mg. Salas',
      creditos: 4,
      nota: 13,
      asistencia: 80,
      progreso: 60,
      horario: 'Mié/Vie 16:00-18:00',
      abrev: 'IA',
      evaluacionesDetalle: []
    },
    {
      id: 6,
      nombre: 'Ética Profesional',
      codigo: 'GEN101',
      profesor: 'Lic. Morales',
      creditos: 2,
      nota: 15.5,
      asistencia: 85,
      progreso: 65,
      horario: 'Sáb 09:00-11:00',
      abrev: 'ÉT',
      evaluacionesDetalle: []
    }
  ];

  return cursos.find(c => c.id === id) || null;
}
}
