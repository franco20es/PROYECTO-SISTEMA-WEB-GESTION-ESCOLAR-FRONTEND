import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

type AsistenciaEstado = 'Presente' | 'Tardanza' | 'Falta' | 'Justificado';
type RangoFiltro = 'Diario' | 'Semanal' | 'Mensual';

interface RegistroAsistencia {
  fecha: string;
  estado: AsistenciaEstado;
  horaIngreso: string;
  observacion: string;
  justificacion: string;
}

interface EstudianteAsistencia {
  id: number;
  codigo: string;
  nombre: string;
  apellido: string;
  fotoUrl: string;
  curso: string;
  materia: string;
  seccion: string;
  correo: string;
  apoderado: string;
  historial: RegistroAsistencia[];
}

interface AlertaAsistencia {
  estudianteId: number;
  estudiante: string;
  tipo: 'Consecutivas' | 'Baja asistencia' | 'Riesgo';
  mensaje: string;
}

interface EstadisticasPeriodo {
  total: number;
  presentes: number;
  tardanzas: number;
  faltas: number;
  justificados: number;
  asistenciaGeneral: number;
}

interface PuntoGrafico {
  label: string;
  valor: number;
  clase: string;
}

@Component({
  selector: 'app-asistencia',
  imports: [FormsModule],
  templateUrl: './asistencia.html',
  styleUrl: './asistencia.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Asistencia {
  readonly fechaSeleccionada = signal(this.toIsoDate(new Date()));
  readonly rangoFiltro = signal<RangoFiltro>('Diario');
  readonly cursoSeleccionado = signal('Todos');
  readonly materiaSeleccionada = signal('Todos');
  readonly seccionSeleccionada = signal('Todos');
  readonly estadoSeleccionado = signal<'Todos' | AsistenciaEstado>('Todos');
  readonly busqueda = signal('');
  readonly studentIdHistorial = signal<number | null>(null);
  readonly aviso = signal('');

  readonly estudiantes = signal<EstudianteAsistencia[]>(this.buildEstudiantes());

  readonly cursosDisponibles = computed(() =>
    ['Todos', ...new Set(this.estudiantes().map((e) => e.curso))].sort(),
  );

  readonly materiasDisponibles = computed(() =>
    ['Todos', ...new Set(this.estudiantes().map((e) => e.materia))].sort(),
  );

  readonly seccionesDisponibles = computed(() =>
    ['Todos', ...new Set(this.estudiantes().map((e) => e.seccion))].sort(),
  );

  readonly cohortFiltrado = computed(() => {
    const term = this.busqueda().trim().toLowerCase();
    const curso = this.cursoSeleccionado();
    const materia = this.materiaSeleccionada();
    const seccion = this.seccionSeleccionada();

    return this.estudiantes().filter((estudiante) => {
      const cumpleBusqueda =
        term.length === 0 ||
        estudiante.nombre.toLowerCase().includes(term) ||
        estudiante.apellido.toLowerCase().includes(term) ||
        estudiante.codigo.toLowerCase().includes(term);

      const cumpleCurso = curso === 'Todos' || estudiante.curso === curso;
      const cumpleMateria = materia === 'Todos' || estudiante.materia === materia;
      const cumpleSeccion = seccion === 'Todos' || estudiante.seccion === seccion;

      return cumpleBusqueda && cumpleCurso && cumpleMateria && cumpleSeccion;
    });
  });

  readonly snapshotMap = computed(() => {
    const [inicio, fin] = this.getRangeBounds(
      this.fechaSeleccionada(),
      this.rangoFiltro(),
    );
    const map = new Map<number, RegistroAsistencia>();

    this.cohortFiltrado().forEach((estudiante) => {
      map.set(
        estudiante.id,
        this.resolveSnapshot(estudiante.historial, inicio, fin),
      );
    });

    return map;
  });

  readonly estudiantesFiltrados = computed(() => {
    const estado = this.estadoSeleccionado();
    if (estado === 'Todos') return this.cohortFiltrado();

    return this.cohortFiltrado().filter(
      (estudiante) => this.getSnapshot(estudiante.id).estado === estado,
    );
  });

  readonly statsActuales = computed(() => {
    const data = this.estudiantesFiltrados().map((estudiante) =>
      this.getSnapshot(estudiante.id),
    );
    return this.buildStats(data);
  });

  readonly statsPrevias = computed(() => {
    const [inicio, fin] = this.getRangeBounds(
      this.fechaSeleccionada(),
      this.rangoFiltro(),
    );
    const cantidadDias = this.diffDays(inicio, fin) + 1;
    const prevFin = this.addDays(inicio, -1);
    const prevInicio = this.addDays(prevFin, -(cantidadDias - 1));
    const prevFinIso = this.toIsoDate(prevFin);
    const prevInicioIso = this.toIsoDate(prevInicio);

    const data = this.estudiantesFiltrados().map((estudiante) =>
      this.resolveSnapshot(estudiante.historial, prevInicioIso, prevFinIso),
    );

    return this.buildStats(data);
  });

  readonly totalEstudiantes = computed(() => this.statsActuales().total);
  readonly presentesHoy = computed(() => this.statsActuales().presentes);
  readonly tardanzasHoy = computed(() => this.statsActuales().tardanzas);
  readonly faltasHoy = computed(() => this.statsActuales().faltas);
  readonly justificadosHoy = computed(() => this.statsActuales().justificados);
  readonly asistenciaGeneral = computed(
    () => `${this.statsActuales().asistenciaGeneral.toFixed(1)}%`,
  );

  readonly alertas = computed(() => {
    const anio = this.getYear(this.fechaSeleccionada());
    const alertas: AlertaAsistencia[] = [];

    this.estudiantesFiltrados().forEach((estudiante) => {
      const consecutivas = this.maxFaltasConsecutivas(estudiante.historial);
      const porcentajeAnual = this.computeAttendancePercent(
        estudiante.historial,
        `${anio}-01-01`,
        `${anio}-12-31`,
      );
      const riesgo = this.computeRiesgoInasistencia(estudiante.historial);
      const nombre = `${estudiante.nombre} ${estudiante.apellido}`;

      if (consecutivas >= 3) {
        alertas.push({
          estudianteId: estudiante.id,
          estudiante: nombre,
          tipo: 'Consecutivas',
          mensaje: `${consecutivas} faltas consecutivas detectadas`,
        });
      }

      if (porcentajeAnual < 75) {
        alertas.push({
          estudianteId: estudiante.id,
          estudiante: nombre,
          tipo: 'Baja asistencia',
          mensaje: `Asistencia anual en ${porcentajeAnual.toFixed(1)}%`,
        });
      }

      if (riesgo >= 30) {
        alertas.push({
          estudianteId: estudiante.id,
          estudiante: nombre,
          tipo: 'Riesgo',
          mensaje: `Riesgo de desaprobacion por inasistencia (${riesgo.toFixed(1)}%)`,
        });
      }
    });

    return alertas;
  });

  readonly estudianteHistorial = computed(() => {
    const id = this.studentIdHistorial();
    if (id === null) return null;
    return this.estudiantes().find((e) => e.id === id) ?? null;
  });

  readonly porcentajeMensualHistorial = computed(() => {
    const estudiante = this.estudianteHistorial();
    if (!estudiante) return '0.0%';

    const fecha = this.fechaSeleccionada();
    const month = this.getMonth(fecha);
    const year = this.getYear(fecha);
    const start = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const end = `${year}-${String(month + 1).padStart(2, '0')}-${String(this.daysInMonth(year, month)).padStart(2, '0')}`;
    return `${this.computeAttendancePercent(estudiante.historial, start, end).toFixed(1)}%`;
  });

  readonly porcentajeAnualHistorial = computed(() => {
    const estudiante = this.estudianteHistorial();
    if (!estudiante) return '0.0%';
    const year = this.getYear(this.fechaSeleccionada());
    return `${this.computeAttendancePercent(estudiante.historial, `${year}-01-01`, `${year}-12-31`).toFixed(1)}%`;
  });

  readonly tardanzasAcumuladasHistorial = computed(() => {
    const estudiante = this.estudianteHistorial();
    if (!estudiante) return 0;
    const year = this.getYear(this.fechaSeleccionada());
    return estudiante.historial.filter(
      (r) => r.fecha.startsWith(String(year)) && r.estado === 'Tardanza',
    ).length;
  });

  readonly justificacionesHistorial = computed(() => {
    const estudiante = this.estudianteHistorial();
    if (!estudiante) return [];
    return estudiante.historial
      .filter((r) => r.estado === 'Justificado' && r.justificacion.length > 0)
      .sort((a, b) => b.fecha.localeCompare(a.fecha))
      .slice(0, 10);
  });

  readonly calendarioHistorial = computed(() => {
    const estudiante = this.estudianteHistorial();
    if (!estudiante) return [];

    const fechaBase = this.fromIso(this.fechaSeleccionada());
    const dias: Array<{ dia: string; estado: AsistenciaEstado | 'Sin registro' }> = [];

    for (let i = 29; i >= 0; i -= 1) {
      const fecha = this.addDays(fechaBase, -i);
      const iso = this.toIsoDate(fecha);
      const registro = estudiante.historial.find((r) => r.fecha === iso);
      dias.push({
        dia: String(fecha.getDate()).padStart(2, '0'),
        estado: registro?.estado ?? 'Sin registro',
      });
    }

    return dias;
  });

  readonly barrasHistorial = computed<PuntoGrafico[]>(() => {
    const estudiante = this.estudianteHistorial();
    if (!estudiante) return [];

    const year = String(this.getYear(this.fechaSeleccionada()));
    const dataAnual = estudiante.historial.filter((r) => r.fecha.startsWith(year));
    const total = dataAnual.length || 1;

    const presentes = dataAnual.filter((r) => r.estado === 'Presente').length;
    const tardanzas = dataAnual.filter((r) => r.estado === 'Tardanza').length;
    const faltas = dataAnual.filter((r) => r.estado === 'Falta').length;
    const justificados = dataAnual.filter((r) => r.estado === 'Justificado').length;

    return [
      {
        label: 'Presente',
        valor: Math.round((presentes / total) * 100),
        clase: 'bar-presente',
      },
      {
        label: 'Tardanza',
        valor: Math.round((tardanzas / total) * 100),
        clase: 'bar-tardanza',
      },
      {
        label: 'Falta',
        valor: Math.round((faltas / total) * 100),
        clase: 'bar-falta',
      },
      {
        label: 'Justificado',
        valor: Math.round((justificados / total) * 100),
        clase: 'bar-justificado',
      },
    ];
  });

  onFecha(value: string): void {
    this.fechaSeleccionada.set(value);
  }

  onCurso(value: string): void {
    this.cursoSeleccionado.set(value);
  }

  onMateria(value: string): void {
    this.materiaSeleccionada.set(value);
  }

  onSeccion(value: string): void {
    this.seccionSeleccionada.set(value);
  }

  onEstado(value: string): void {
    this.estadoSeleccionado.set(value as 'Todos' | AsistenciaEstado);
  }

  onRango(value: string): void {
    this.rangoFiltro.set(value as RangoFiltro);
  }

  onBuscar(value: string): void {
    this.busqueda.set(value);
  }

  tomarAsistencia(): void {
    const fecha = this.fechaSeleccionada();
    const ids = this.estudiantesFiltrados().map((e) => e.id);

    this.studentsBulkUpsert(ids, {
      fecha,
      estado: 'Presente',
      horaIngreso: '07:45',
      observacion: 'Registro inicial del dia',
      justificacion: '',
    }, true);

    this.aviso.set('Asistencia tomada para el grupo filtrado.');
  }

  exportarReporte(): void {
    const filas = this.estudiantesFiltrados().map((estudiante) => {
      const registro = this.getSnapshot(estudiante.id);
      return [
        estudiante.codigo,
        `${estudiante.nombre} ${estudiante.apellido}`,
        estudiante.curso,
        estudiante.materia,
        estudiante.seccion,
        registro.estado,
        registro.horaIngreso,
        registro.observacion,
      ];
    });

    const cabecera =
      'codigo,estudiante,curso,materia,seccion,estado,hora_ingreso,observacion';
    const csv = [
      cabecera,
      ...filas.map((fila) =>
        fila
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(','),
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `asistencia-${this.fechaSeleccionada()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    this.aviso.set('Reporte exportado correctamente.');
  }

  editarRegistro(studentId: number): void {
    const texto = window.prompt('Editar observacion del registro', '');
    if (texto === null) return;
    this.actualizarObservacion(studentId, texto.trim());
  }

  abrirHistorial(studentId: number): void {
    this.studentIdHistorial.set(studentId);
  }

  cerrarHistorial(): void {
    this.studentIdHistorial.set(null);
  }

  marcarPresente(studentId: number): void {
    this.upsertEstado(studentId, 'Presente', '07:45', 'Asistencia correcta');
  }

  marcarTardanza(studentId: number): void {
    this.upsertEstado(studentId, 'Tardanza', '08:15', 'Ingreso fuera de hora');
  }

  marcarFalta(studentId: number): void {
    this.upsertEstado(studentId, 'Falta', '--:--', 'Inasistencia registrada');
  }

  justificarFalta(studentId: number): void {
    const motivo = window.prompt('Motivo de justificacion', 'Cita medica');
    if (motivo === null) return;

    this.upsertEstado(
      studentId,
      'Justificado',
      '--:--',
      'Falta justificada por docente',
      motivo.trim(),
    );
  }

  agregarObservacion(studentId: number): void {
    const observacion = window.prompt('Agregar observacion', '');
    if (observacion === null) return;
    this.actualizarObservacion(studentId, observacion.trim());
  }

  contactarApoderado(studentId: number): void {
    const estudiante = this.estudiantes().find((e) => e.id === studentId);
    if (!estudiante) return;
    this.aviso.set(`Contacto con apoderado de ${estudiante.nombre} (placeholder).`);
  }

  getSnapshot(studentId: number): RegistroAsistencia {
    return (
      this.snapshotMap().get(studentId) ?? {
        fecha: this.fechaSeleccionada(),
        estado: 'Falta',
        horaIngreso: '--:--',
        observacion: 'Sin registro en el periodo',
        justificacion: '',
      }
    );
  }

  estadoClass(estado: AsistenciaEstado): string {
    if (estado === 'Presente') return 'chip chip-presente';
    if (estado === 'Tardanza') return 'chip chip-tardanza';
    if (estado === 'Falta') return 'chip chip-falta';
    return 'chip chip-justificado';
  }

  deltaClass(delta: number): string {
    if (delta > 0) return 'delta delta-up';
    if (delta < 0) return 'delta delta-down';
    return 'delta delta-neutral';
  }

  deltaTexto(valorActual: number, valorPrevio: number): string {
    if (valorPrevio === 0) return 'Sin comparacion';
    const delta = ((valorActual - valorPrevio) / valorPrevio) * 100;
    const signo = delta > 0 ? '+' : '';
    return `${signo}${delta.toFixed(1)}% vs semana pasada`;
  }

  deltaNumero(valorActual: number, valorPrevio: number): number {
    if (valorPrevio === 0) return 0;
    return ((valorActual - valorPrevio) / valorPrevio) * 100;
  }

  calendarClass(estado: AsistenciaEstado | 'Sin registro'): string {
    if (estado === 'Presente') return 'cal-dia cal-presente';
    if (estado === 'Tardanza') return 'cal-dia cal-tardanza';
    if (estado === 'Falta') return 'cal-dia cal-falta';
    if (estado === 'Justificado') return 'cal-dia cal-justificado';
    return 'cal-dia cal-empty';
  }

  private upsertEstado(
    studentId: number,
    estado: AsistenciaEstado,
    horaIngreso: string,
    observacion: string,
    justificacion = '',
  ): void {
    const fecha = this.fechaSeleccionada();
    this.studentsBulkUpsert(
      [studentId],
      { fecha, estado, horaIngreso, observacion, justificacion },
      false,
    );
    this.aviso.set('Registro actualizado correctamente.');
  }

  private actualizarObservacion(studentId: number, observacion: string): void {
    const fecha = this.fechaSeleccionada();

    this.estudiantes.update((estudiantes) =>
      estudiantes.map((estudiante) => {
        if (estudiante.id !== studentId) return estudiante;

        const historial = this.upsertRegistro(estudiante.historial, {
          fecha,
          estado: this.getSnapshot(studentId).estado,
          horaIngreso: this.getSnapshot(studentId).horaIngreso,
          observacion,
          justificacion: this.getSnapshot(studentId).justificacion,
        });

        return { ...estudiante, historial };
      }),
    );

    this.aviso.set('Observacion guardada.');
  }

  private studentsBulkUpsert(
    studentIds: number[],
    registro: RegistroAsistencia,
    onlyIfMissing: boolean,
  ): void {
    this.estudiantes.update((estudiantes) =>
      estudiantes.map((estudiante) => {
        if (!studentIds.includes(estudiante.id)) return estudiante;

        const existe = estudiante.historial.some((r) => r.fecha === registro.fecha);
        if (onlyIfMissing && existe) return estudiante;

        return {
          ...estudiante,
          historial: this.upsertRegistro(estudiante.historial, registro),
        };
      }),
    );
  }

  private upsertRegistro(
    historial: RegistroAsistencia[],
    registro: RegistroAsistencia,
  ): RegistroAsistencia[] {
    const index = historial.findIndex((r) => r.fecha === registro.fecha);

    if (index === -1) {
      return [...historial, registro].sort((a, b) => b.fecha.localeCompare(a.fecha));
    }

    return historial
      .map((item, i) => (i === index ? { ...item, ...registro } : item))
      .sort((a, b) => b.fecha.localeCompare(a.fecha));
  }

  private resolveSnapshot(
    historial: RegistroAsistencia[],
    inicio: string,
    fin: string,
  ): RegistroAsistencia {
    const dentroRango = historial
      .filter((r) => r.fecha >= inicio && r.fecha <= fin)
      .sort((a, b) => b.fecha.localeCompare(a.fecha));

    if (dentroRango.length > 0) return dentroRango[0];

    return {
      fecha: fin,
      estado: 'Falta',
      horaIngreso: '--:--',
      observacion: 'Sin registro en el periodo',
      justificacion: '',
    };
  }

  private buildStats(registros: RegistroAsistencia[]): EstadisticasPeriodo {
    const total = registros.length;
    const presentes = registros.filter((r) => r.estado === 'Presente').length;
    const tardanzas = registros.filter((r) => r.estado === 'Tardanza').length;
    const faltas = registros.filter((r) => r.estado === 'Falta').length;
    const justificados = registros.filter((r) => r.estado === 'Justificado').length;
    const asistenciaGeneral =
      total === 0 ? 0 : ((presentes + tardanzas + justificados) / total) * 100;

    return {
      total,
      presentes,
      tardanzas,
      faltas,
      justificados,
      asistenciaGeneral,
    };
  }

  private getRangeBounds(
    fechaIso: string,
    rango: RangoFiltro,
  ): [string, string] {
    const fecha = this.fromIso(fechaIso);

    if (rango === 'Diario') {
      return [fechaIso, fechaIso];
    }

    if (rango === 'Semanal') {
      const day = fecha.getDay() === 0 ? 7 : fecha.getDay();
      const inicio = this.addDays(fecha, -(day - 1));
      const fin = this.addDays(inicio, 6);
      return [this.toIsoDate(inicio), this.toIsoDate(fin)];
    }

    const inicioMes = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
    const finMes = new Date(
      fecha.getFullYear(),
      fecha.getMonth(),
      this.daysInMonth(fecha.getFullYear(), fecha.getMonth()),
    );
    return [this.toIsoDate(inicioMes), this.toIsoDate(finMes)];
  }

  private maxFaltasConsecutivas(historial: RegistroAsistencia[]): number {
    const ordenado = [...historial].sort((a, b) => b.fecha.localeCompare(a.fecha));
    let max = 0;
    let actual = 0;

    for (const registro of ordenado) {
      if (registro.estado === 'Falta') {
        actual += 1;
        if (actual > max) max = actual;
      } else {
        actual = 0;
      }
    }

    return max;
  }

  private computeAttendancePercent(
    historial: RegistroAsistencia[],
    inicio: string,
    fin: string,
  ): number {
    const dentro = historial.filter((r) => r.fecha >= inicio && r.fecha <= fin);
    if (dentro.length === 0) return 0;
    const validos = dentro.filter(
      (r) => r.estado === 'Presente' || r.estado === 'Tardanza' || r.estado === 'Justificado',
    ).length;
    return (validos / dentro.length) * 100;
  }

  private computeRiesgoInasistencia(historial: RegistroAsistencia[]): number {
    if (historial.length === 0) return 0;
    const faltas = historial.filter((r) => r.estado === 'Falta').length;
    const tardanzas = historial.filter((r) => r.estado === 'Tardanza').length;
    return ((faltas + tardanzas * 0.5) / historial.length) * 100;
  }

  private buildEstudiantes(): EstudianteAsistencia[] {
    const base: Array<Omit<EstudianteAsistencia, 'historial'>> = [
      {
        id: 1,
        codigo: 'EST-24001',
        nombre: 'Lucia',
        apellido: 'Mendoza',
        fotoUrl: 'https://i.pravatar.cc/96?img=32',
        curso: '5to Primaria',
        materia: 'Comunicación',
        seccion: 'A',
        correo: 'lucia.mendoza@colegio.edu.pe',
        apoderado: 'Sr. Mendoza - 987654321',
      },
      {
        id: 2,
        codigo: 'EST-24002',
        nombre: 'Mateo',
        apellido: 'Vargas',
        fotoUrl: 'https://i.pravatar.cc/96?img=14',
        curso: '1ro Secundaria',
        materia: 'Matemáticas',
        seccion: 'B',
        correo: 'mateo.vargas@colegio.edu.pe',
        apoderado: 'Sra. Vargas - 985421233',
      },
      {
        id: 3,
        codigo: 'EST-24003',
        nombre: 'Camila',
        apellido: 'Huaman',
        fotoUrl: 'https://i.pravatar.cc/96?img=47',
        curso: '3ro Secundaria',
        materia: 'Ciencias',
        seccion: 'A',
        correo: 'camila.huaman@colegio.edu.pe',
        apoderado: 'Sra. Huaman - 964221177',
      },
      {
        id: 4,
        codigo: 'EST-24004',
        nombre: 'Diego',
        apellido: 'Paredes',
        fotoUrl: 'https://i.pravatar.cc/96?img=11',
        curso: '6to Primaria',
        materia: 'Historia',
        seccion: 'C',
        correo: 'diego.paredes@colegio.edu.pe',
        apoderado: 'Sr. Paredes - 996331002',
      },
      {
        id: 5,
        codigo: 'EST-24005',
        nombre: 'Valentina',
        apellido: 'Quispe',
        fotoUrl: 'https://i.pravatar.cc/96?img=25',
        curso: '2do Secundaria',
        materia: 'Inglés',
        seccion: 'A',
        correo: 'valentina.quispe@colegio.edu.pe',
        apoderado: 'Sra. Quispe - 955122443',
      },
      {
        id: 6,
        codigo: 'EST-24006',
        nombre: 'Sebastian',
        apellido: 'Cruz',
        fotoUrl: 'https://i.pravatar.cc/96?img=8',
        curso: '4to Primaria',
        materia: 'Arte',
        seccion: 'B',
        correo: 'sebastian.cruz@colegio.edu.pe',
        apoderado: 'Sr. Cruz - 933401299',
      },
      {
        id: 7,
        codigo: 'EST-24007',
        nombre: 'Ariana',
        apellido: 'Flores',
        fotoUrl: 'https://i.pravatar.cc/96?img=43',
        curso: '5to Secundaria',
        materia: 'Matemáticas',
        seccion: 'A',
        correo: 'ariana.flores@colegio.edu.pe',
        apoderado: 'Sra. Flores - 944331288',
      },
      {
        id: 8,
        codigo: 'EST-24008',
        nombre: 'Thiago',
        apellido: 'Luna',
        fotoUrl: 'https://i.pravatar.cc/96?img=19',
        curso: '2do Primaria',
        materia: 'Comunicación',
        seccion: 'C',
        correo: 'thiago.luna@colegio.edu.pe',
        apoderado: 'Sr. Luna - 966455781',
      },
      {
        id: 9,
        codigo: 'EST-24009',
        nombre: 'Renata',
        apellido: 'Salas',
        fotoUrl: 'https://i.pravatar.cc/96?img=9',
        curso: '3ro Primaria',
        materia: 'Matemáticas',
        seccion: 'A',
        correo: 'renata.salas@colegio.edu.pe',
        apoderado: 'Sra. Salas - 922114488',
      },
      {
        id: 10,
        codigo: 'EST-24010',
        nombre: 'Nicolas',
        apellido: 'Torres',
        fotoUrl: 'https://i.pravatar.cc/96?img=20',
        curso: '4to Secundaria',
        materia: 'Ciencias',
        seccion: 'B',
        correo: 'nicolas.torres@colegio.edu.pe',
        apoderado: 'Sr. Torres - 977662110',
      },
      {
        id: 11,
        codigo: 'EST-24011',
        nombre: 'Mariana',
        apellido: 'Castro',
        fotoUrl: 'https://i.pravatar.cc/96?img=36',
        curso: '1ro Primaria',
        materia: 'Comunicación',
        seccion: 'A',
        correo: 'mariana.castro@colegio.edu.pe',
        apoderado: 'Sra. Castro - 988702615',
      },
      {
        id: 12,
        codigo: 'EST-24012',
        nombre: 'Franco',
        apellido: 'Ramos',
        fotoUrl: 'https://i.pravatar.cc/96?img=2',
        curso: '6to Primaria',
        materia: 'Historia',
        seccion: 'B',
        correo: 'franco.ramos@colegio.edu.pe',
        apoderado: 'Sr. Ramos - 901552711',
      },
    ];

    return base.map((estudiante) => ({
      ...estudiante,
      historial: this.generarHistorial(estudiante.id),
    }));
  }

  private generarHistorial(studentId: number): RegistroAsistencia[] {
    const today = new Date();
    const historial: RegistroAsistencia[] = [];

    for (let i = 0; i < 120; i += 1) {
      const date = this.addDays(today, -i);
      const day = date.getDay();

      // Solo dias lectivos
      if (day === 0 || day === 6) continue;

      const selector = (studentId * 37 + i * 13) % 100;
      let estado: AsistenciaEstado = 'Presente';

      if (selector < 66) estado = 'Presente';
      else if (selector < 80) estado = 'Tardanza';
      else if (selector < 92) estado = 'Falta';
      else estado = 'Justificado';

      historial.push({
        fecha: this.toIsoDate(date),
        estado,
        horaIngreso:
          estado === 'Presente'
            ? '07:45'
            : estado === 'Tardanza'
              ? '08:14'
              : '--:--',
        observacion:
          estado === 'Presente'
            ? 'Ingreso regular'
            : estado === 'Tardanza'
              ? 'Ingreso tardio'
              : estado === 'Falta'
                ? 'Inasistencia'
                : 'Falta justificada',
        justificacion: estado === 'Justificado' ? 'Documento sustentatorio' : '',
      });
    }

    // Casos de riesgo para demostrar alertas automaticas.
    if (studentId === 3 || studentId === 10) {
      for (let i = 0; i < 4; i += 1) {
        const fecha = this.toIsoDate(this.addDays(today, -i));
        const idx = historial.findIndex((r) => r.fecha === fecha);
        if (idx >= 0) {
          historial[idx] = {
            ...historial[idx],
            estado: 'Falta',
            horaIngreso: '--:--',
            observacion: 'Falta consecutiva',
            justificacion: '',
          };
        }
      }
    }

    return historial.sort((a, b) => b.fecha.localeCompare(a.fecha));
  }

  private addDays(base: Date | string, days: number): Date {
    const date = typeof base === 'string' ? this.fromIso(base) : new Date(base);
    date.setDate(date.getDate() + days);
    return date;
  }

  private diffDays(inicioIso: string, finIso: string): number {
    const inicio = this.fromIso(inicioIso).getTime();
    const fin = this.fromIso(finIso).getTime();
    return Math.round((fin - inicio) / (1000 * 60 * 60 * 24));
  }

  private toIsoDate(date: Date): string {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
  }

  private fromIso(iso: string): Date {
    const [year, month, day] = iso.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  private getYear(iso: string): number {
    return Number(iso.slice(0, 4));
  }

  private getMonth(iso: string): number {
    return Number(iso.slice(5, 7)) - 1;
  }

  private daysInMonth(year: number, monthZeroBased: number): number {
    return new Date(year, monthZeroBased + 1, 0).getDate();
  }
}
