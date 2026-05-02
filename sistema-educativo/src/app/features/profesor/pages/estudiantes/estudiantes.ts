import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

type EstadoAcademico = 'Excelente' | 'Regular' | 'Riesgo';

interface Estudiante {
  id: number;
  codigo: string;
  nombre: string;
  apellido: string;
  fotoUrl: string;
  cursoGrado: string;
  materiaPrincipal: string;
  docenteCargo: string;
  correo: string;
  promedioGeneral: number;
  asistencia: number;
  estadoAcademico: EstadoAcademico;
  progresoAcademico: number;
}

@Component({
  selector: 'app-estudiantes',
  imports: [FormsModule],
  templateUrl: './estudiantes.html',
  styleUrl: './estudiantes.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Estudiantes {
  readonly busqueda = signal('');
  readonly filtroCurso = signal('Todos');
  readonly filtroMateria = signal('Todos');
  readonly filtroEstado = signal('Todos');
  readonly filtroAsistencia = signal('Todos');

  readonly estudiantes = signal<Estudiante[]>([
    {
      id: 1,
      codigo: 'EST-24001',
      nombre: 'Lucia',
      apellido: 'Mendoza',
      fotoUrl: 'https://i.pravatar.cc/120?img=32',
      cursoGrado: '5to Primaria',
      materiaPrincipal: 'Comunicación',
      docenteCargo: 'Prof. Andrea Rojas',
      correo: 'lucia.mendoza@colegio.edu.pe',
      promedioGeneral: 18.1,
      asistencia: 96,
      estadoAcademico: 'Excelente',
      progresoAcademico: 88,
    },
    {
      id: 2,
      codigo: 'EST-24002',
      nombre: 'Mateo',
      apellido: 'Vargas',
      fotoUrl: 'https://i.pravatar.cc/120?img=14',
      cursoGrado: '1ro Secundaria',
      materiaPrincipal: 'Matemáticas',
      docenteCargo: 'Prof. Jorge Palacios',
      correo: 'mateo.vargas@colegio.edu.pe',
      promedioGeneral: 14.7,
      asistencia: 84,
      estadoAcademico: 'Regular',
      progresoAcademico: 63,
    },
    {
      id: 3,
      codigo: 'EST-24003',
      nombre: 'Camila',
      apellido: 'Huaman',
      fotoUrl: 'https://i.pravatar.cc/120?img=47',
      cursoGrado: '3ro Secundaria',
      materiaPrincipal: 'Ciencias',
      docenteCargo: 'Prof. Elena Solis',
      correo: 'camila.huaman@colegio.edu.pe',
      promedioGeneral: 12.3,
      asistencia: 71,
      estadoAcademico: 'Riesgo',
      progresoAcademico: 45,
    },
    {
      id: 4,
      codigo: 'EST-24004',
      nombre: 'Diego',
      apellido: 'Paredes',
      fotoUrl: 'https://i.pravatar.cc/120?img=11',
      cursoGrado: '6to Primaria',
      materiaPrincipal: 'Historia',
      docenteCargo: 'Prof. Gino Marquez',
      correo: 'diego.paredes@colegio.edu.pe',
      promedioGeneral: 16.2,
      asistencia: 90,
      estadoAcademico: 'Excelente',
      progresoAcademico: 79,
    },
    {
      id: 5,
      codigo: 'EST-24005',
      nombre: 'Valentina',
      apellido: 'Quispe',
      fotoUrl: 'https://i.pravatar.cc/120?img=25',
      cursoGrado: '2do Secundaria',
      materiaPrincipal: 'Inglés',
      docenteCargo: 'Prof. Lucia Fuentes',
      correo: 'valentina.quispe@colegio.edu.pe',
      promedioGeneral: 13.6,
      asistencia: 78,
      estadoAcademico: 'Regular',
      progresoAcademico: 58,
    },
    {
      id: 6,
      codigo: 'EST-24006',
      nombre: 'Sebastian',
      apellido: 'Cruz',
      fotoUrl: 'https://i.pravatar.cc/120?img=8',
      cursoGrado: '4to Primaria',
      materiaPrincipal: 'Arte',
      docenteCargo: 'Prof. Raul Vela',
      correo: 'sebastian.cruz@colegio.edu.pe',
      promedioGeneral: 10.9,
      asistencia: 66,
      estadoAcademico: 'Riesgo',
      progresoAcademico: 39,
    },
    {
      id: 7,
      codigo: 'EST-24007',
      nombre: 'Ariana',
      apellido: 'Flores',
      fotoUrl: 'https://i.pravatar.cc/120?img=43',
      cursoGrado: '5to Secundaria',
      materiaPrincipal: 'Matemáticas',
      docenteCargo: 'Prof. Jorge Palacios',
      correo: 'ariana.flores@colegio.edu.pe',
      promedioGeneral: 17.4,
      asistencia: 94,
      estadoAcademico: 'Excelente',
      progresoAcademico: 86,
    },
    {
      id: 8,
      codigo: 'EST-24008',
      nombre: 'Thiago',
      apellido: 'Luna',
      fotoUrl: 'https://i.pravatar.cc/120?img=19',
      cursoGrado: '2do Primaria',
      materiaPrincipal: 'Comunicación',
      docenteCargo: 'Prof. Andrea Rojas',
      correo: 'thiago.luna@colegio.edu.pe',
      promedioGeneral: 15.1,
      asistencia: 88,
      estadoAcademico: 'Regular',
      progresoAcademico: 67,
    },
    {
      id: 9,
      codigo: 'EST-24009',
      nombre: 'Renata',
      apellido: 'Salas',
      fotoUrl: 'https://i.pravatar.cc/120?img=9',
      cursoGrado: '3ro Primaria',
      materiaPrincipal: 'Matemáticas',
      docenteCargo: 'Prof. Jorge Palacios',
      correo: 'renata.salas@colegio.edu.pe',
      promedioGeneral: 16.8,
      asistencia: 92,
      estadoAcademico: 'Excelente',
      progresoAcademico: 82,
    },
    {
      id: 10,
      codigo: 'EST-24010',
      nombre: 'Nicolas',
      apellido: 'Torres',
      fotoUrl: 'https://i.pravatar.cc/120?img=20',
      cursoGrado: '4to Secundaria',
      materiaPrincipal: 'Ciencias',
      docenteCargo: 'Prof. Elena Solis',
      correo: 'nicolas.torres@colegio.edu.pe',
      promedioGeneral: 12.8,
      asistencia: 73,
      estadoAcademico: 'Riesgo',
      progresoAcademico: 48,
    },
    {
      id: 11,
      codigo: 'EST-24011',
      nombre: 'Mariana',
      apellido: 'Castro',
      fotoUrl: 'https://i.pravatar.cc/120?img=36',
      cursoGrado: '1ro Primaria',
      materiaPrincipal: 'Comunicación',
      docenteCargo: 'Prof. Andrea Rojas',
      correo: 'mariana.castro@colegio.edu.pe',
      promedioGeneral: 15.7,
      asistencia: 89,
      estadoAcademico: 'Regular',
      progresoAcademico: 70,
    },
    {
      id: 12,
      codigo: 'EST-24012',
      nombre: 'Franco',
      apellido: 'Ramos',
      fotoUrl: 'https://i.pravatar.cc/120?img=2',
      cursoGrado: '6to Primaria',
      materiaPrincipal: 'Historia',
      docenteCargo: 'Prof. Gino Marquez',
      correo: 'franco.ramos@colegio.edu.pe',
      promedioGeneral: 14.4,
      asistencia: 81,
      estadoAcademico: 'Regular',
      progresoAcademico: 61,
    },
    {
      id: 13,
      codigo: 'EST-24013',
      nombre: 'Alessia',
      apellido: 'Navarro',
      fotoUrl: 'https://i.pravatar.cc/120?img=40',
      cursoGrado: '2do Secundaria',
      materiaPrincipal: 'Inglés',
      docenteCargo: 'Prof. Lucia Fuentes',
      correo: 'alessia.navarro@colegio.edu.pe',
      promedioGeneral: 17.0,
      asistencia: 95,
      estadoAcademico: 'Excelente',
      progresoAcademico: 84,
    },
    {
      id: 14,
      codigo: 'EST-24014',
      nombre: 'Joaquin',
      apellido: 'Benites',
      fotoUrl: 'https://i.pravatar.cc/120?img=15',
      cursoGrado: '5to Primaria',
      materiaPrincipal: 'Arte',
      docenteCargo: 'Prof. Raul Vela',
      correo: 'joaquin.benites@colegio.edu.pe',
      promedioGeneral: 11.8,
      asistencia: 69,
      estadoAcademico: 'Riesgo',
      progresoAcademico: 42,
    },
    {
      id: 15,
      codigo: 'EST-24015',
      nombre: 'Daniela',
      apellido: 'Ponce',
      fotoUrl: 'https://i.pravatar.cc/120?img=45',
      cursoGrado: '3ro Secundaria',
      materiaPrincipal: 'Matemáticas',
      docenteCargo: 'Prof. Jorge Palacios',
      correo: 'daniela.ponce@colegio.edu.pe',
      promedioGeneral: 18.6,
      asistencia: 97,
      estadoAcademico: 'Excelente',
      progresoAcademico: 92,
    },
    {
      id: 16,
      codigo: 'EST-24016',
      nombre: 'Adrian',
      apellido: 'Llerena',
      fotoUrl: 'https://i.pravatar.cc/120?img=6',
      cursoGrado: '1ro Secundaria',
      materiaPrincipal: 'Ciencias',
      docenteCargo: 'Prof. Elena Solis',
      correo: 'adrian.llerena@colegio.edu.pe',
      promedioGeneral: 13.2,
      asistencia: 77,
      estadoAcademico: 'Regular',
      progresoAcademico: 57,
    },
  ]);

  readonly cursosDisponibles = computed(() =>
    ['Todos', ...new Set(this.estudiantes().map((e) => e.cursoGrado))].sort(),
  );

  readonly materiasDisponibles = computed(() =>
    ['Todos', ...new Set(this.estudiantes().map((e) => e.materiaPrincipal))].sort(),
  );

  readonly estadosDisponibles: Array<'Todos' | EstadoAcademico> = [
    'Todos',
    'Excelente',
    'Regular',
    'Riesgo',
  ];

  readonly asistenciasDisponibles = ['Todos', 'Alta', 'Media', 'Baja'];

  readonly estudiantesFiltrados = computed(() => {
    const term = this.busqueda().trim().toLowerCase();
    const curso = this.filtroCurso();
    const materia = this.filtroMateria();
    const estado = this.filtroEstado();
    const asistencia = this.filtroAsistencia();

    return this.estudiantes().filter((estudiante) => {
      const coincideBusqueda =
        term.length === 0 ||
        estudiante.nombre.toLowerCase().includes(term) ||
        estudiante.apellido.toLowerCase().includes(term) ||
        estudiante.codigo.toLowerCase().includes(term);

      const coincideCurso = curso === 'Todos' || estudiante.cursoGrado === curso;
      const coincideMateria =
        materia === 'Todos' || estudiante.materiaPrincipal === materia;
      const coincideEstado =
        estado === 'Todos' || estudiante.estadoAcademico === estado;

      const coincideAsistencia =
        asistencia === 'Todos' ||
        (asistencia === 'Alta' && estudiante.asistencia >= 90) ||
        (asistencia === 'Media' &&
          estudiante.asistencia >= 75 &&
          estudiante.asistencia < 90) ||
        (asistencia === 'Baja' && estudiante.asistencia < 75);

      return (
        coincideBusqueda &&
        coincideCurso &&
        coincideMateria &&
        coincideEstado &&
        coincideAsistencia
      );
    });
  });

  readonly totalEstudiantes = computed(() => this.estudiantesFiltrados().length);

  readonly promedioGeneral = computed(() => {
    const data = this.estudiantesFiltrados();
    if (data.length === 0) return '0.0';
    const valor =
      data.reduce((acc, estudiante) => acc + estudiante.promedioGeneral, 0) /
      data.length;
    return valor.toFixed(1);
  });

  readonly estudiantesRiesgo = computed(
    () =>
      this.estudiantesFiltrados().filter((e) => e.estadoAcademico === 'Riesgo')
        .length,
  );

  readonly asistenciaPromedio = computed(() => {
    const data = this.estudiantesFiltrados();
    if (data.length === 0) return '0%';
    const valor =
      data.reduce((acc, estudiante) => acc + estudiante.asistencia, 0) /
      data.length;
    return `${Math.round(valor)}%`;
  });

  onBuscar(value: string): void {
    this.busqueda.set(value);
  }

  onFiltrarCurso(value: string): void {
    this.filtroCurso.set(value);
  }

  onFiltrarMateria(value: string): void {
    this.filtroMateria.set(value);
  }

  onFiltrarEstado(value: string): void {
    this.filtroEstado.set(value);
  }

  onFiltrarAsistencia(value: string): void {
    this.filtroAsistencia.set(value);
  }

  onVerPerfil(codigo: string): void {
    console.log('Ver perfil:', codigo);
  }

  onCalificar(codigo: string): void {
    console.log('Calificar:', codigo);
  }

  onAsistencia(codigo: string): void {
    console.log('Asistencia:', codigo);
  }

  exportarReporte(): void {
    const data = this.estudiantesFiltrados();
    const cabecera =
      'codigo,nombre,apellido,curso,materia,docente,correo,promedio,asistencia,estado';

    const filas = data.map((e) =>
      [
        e.codigo,
        e.nombre,
        e.apellido,
        e.cursoGrado,
        e.materiaPrincipal,
        e.docenteCargo,
        e.correo,
        e.promedioGeneral.toFixed(1),
        e.asistencia,
        e.estadoAcademico,
      ]
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(','),
    );

    const csv = [cabecera, ...filas].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reporte-estudiantes-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  estadoClass(estado: EstadoAcademico): string {
    if (estado === 'Excelente') return 'status status-excelente';
    if (estado === 'Regular') return 'status status-regular';
    return 'status status-riesgo';
  }

  progressClass(estado: EstadoAcademico): string {
    if (estado === 'Excelente') return 'progress-fill progress-excelente';
    if (estado === 'Regular') return 'progress-fill progress-regular';
    return 'progress-fill progress-riesgo';
  }
}
