// horario-docente.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { HorarioDocenteService } from '../../services/horario.service'; 
import { ToastService } from '../../../../core/services/toast/toast.service'; 

@Component({
  selector: 'app-horario-docente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './horariop.html',
  styleUrl: './horariop.css',
})
export class HorarioDocente implements OnInit {

  private horarioService = inject(HorarioDocenteService);
  private toast          = inject(ToastService);
  private router         = inject(Router);

  anio = new Date().getFullYear();

  DIAS = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES'];
  DIAS_ENUM = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES'];

  // Paleta sobria (fondo suave + barra de color saturada)
  private PALETA = [
    { bg: '#E8F0FE', bar: '#1A73E8' },  // azul Google
    { bg: '#FCE8E6', bar: '#EA4335' },  // rojo
    { bg: '#E6F4EA', bar: '#34A853' },  // verde
    { bg: '#FEF7E0', bar: '#F9AB00' },  // ámbar
    { bg: '#F3E8FD', bar: '#A142F4' },  // morado
    { bg: '#E4F7FB', bar: '#24C1E0' },  // cyan
  ];
  private colorIdx = new Map<string, number>();

  cargando = signal(true);
  horarios = signal<any[]>([]);
  vistaActiva = signal<'grid' | 'list'>('grid');

  // Día de hoy (0=Lun ... 4=Vie, -1 si finde)
  hoyIdx = signal<number>(this.calcularHoy());

  private calcularHoy(): number {
    const d = new Date().getDay(); // 0=Dom,1=Lun...6=Sab
    return (d >= 1 && d <= 5) ? d - 1 : -1;
  }

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.horarioService.miHorario(this.anio).subscribe({
      next: (data) => {
        (data || []).forEach(h => {
          if (!this.colorIdx.has(h.cursoId)) {
            this.colorIdx.set(h.cursoId, this.colorIdx.size % this.PALETA.length);
          }
        });
        this.horarios.set(data || []);
        this.cargando.set(false);
      },
      error: () => { this.horarios.set([]); this.cargando.set(false); }
    });
  }

  // Rango de horas del día: desde la 1ra clase (redondeado abajo) hasta la última (redondeado arriba)
  // Si no hay clases, default 8-15
  horasDelDia = computed(() => {
    const hs = this.horarios();
    if (!hs.length) return [8, 9, 10, 11, 12, 13, 14];
    let min = 23, max = 0;
    hs.forEach(h => {
      const ini = parseInt(h.horaInicio.substring(0, 2), 10);
      const finH = parseInt(h.horaFin.substring(0, 2), 10);
      const finM = parseInt(h.horaFin.substring(3, 5), 10);
      const finReal = finM > 0 ? finH + 1 : finH;
      if (ini < min) min = ini;
      if (finReal > max) max = finReal;
    });
    // Margen de 1h antes y 1h después para dar contexto (que no se vea apretado)
    min = Math.max(7, min - 1);
    max = Math.min(20, max + 1);
    const arr: number[] = [];
    for (let h = min; h < max; h++) arr.push(h);
    return arr.length ? arr : [8, 9, 10, 11, 12];
  });

  // grid-template-rows: cabecera + N horas (cada hora = 64px)
  filasGrid = computed(() => `52px repeat(${this.horasDelDia().length}, 58px)`);

  // Bloques con posición calculada (columna por día, filas por hora con fracción de minutos)
  bloquesPosicionados = computed(() => {
    const horas = this.horasDelDia();
    const horaBase = horas[0];
    return this.horarios().map(h => {
      const diaIdx = this.DIAS_ENUM.indexOf(h.diaSemana);
      const iniH = parseInt(h.horaInicio.substring(0, 2), 10);
      const iniM = parseInt(h.horaInicio.substring(3, 5), 10);
      const finH = parseInt(h.horaFin.substring(0, 2), 10);
      const finM = parseInt(h.horaFin.substring(3, 5), 10);

      // fila inicio: 2 (tras cabecera) + horas transcurridas. +fracción por minutos no se puede en grid simple,
      // así que usamos filas enteras por hora. Para precisión usamos grid-row con span.
      const rowStart = 2 + (iniH - horaBase);
      // duración en horas (redondeo hacia arriba para que cubra)
      const durHoras = Math.max(1, Math.ceil((finH * 60 + finM - (iniH * 60 + iniM)) / 60));
      const rowEnd = rowStart + durHoras;

      const ci = this.colorIdx.get(h.cursoId) ?? 0;
      return {
        id: h.id,
        col: diaIdx + 2,
        rowStart,
        rowEnd,
        horaIni: this.horaCorta(h.horaInicio),
        horaFin: this.horaCorta(h.horaFin),
        colorBg: this.PALETA[ci].bg,
        colorBar: this.PALETA[ci].bar,
        raw: h
      };
    }).filter(b => b.col >= 2); // solo Lun-Vie
  });

  colorBarCurso(cursoId: string): string {
    const ci = this.colorIdx.get(cursoId) ?? 0;
    return this.PALETA[ci].bar;
  }

  clasesDelDia(diaIdx: number): any[] {
    const diaEnum = this.DIAS_ENUM[diaIdx];
    return this.horarios()
      .filter(h => h.diaSemana === diaEnum)
      .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
  }

  // KPIs
  totalHoras = computed(() => {
    let mins = 0;
    this.horarios().forEach(h => {
      mins += this.aMin(h.horaFin) - this.aMin(h.horaInicio);
    });
    return Math.round(mins / 60 * 10) / 10;
  });
  totalCursos = computed(() => new Set(this.horarios().map(h => h.cursoId)).size);
  totalSecciones = computed(() => new Set(this.horarios().map(h => h.seccionId)).size);

  horaCorta(hora: string): string { return hora ? hora.substring(0, 5) : ''; }
  private aMin(hora: string): number { const [h, m] = hora.split(':').map(Number); return h * 60 + m; }

  toggleView(v: 'grid' | 'list'): void { this.vistaActiva.set(v); }

  irAlCurso(bloque: any): void {
    const cursoMini = [{
      id: bloque.cursoId, name: bloque.cursoNombre, codigo: '',
      color: '#1340A0', secs: [bloque.seccionDenominacion], seccionId: bloque.seccionId
    }];
    sessionStorage.setItem('cursosDocente', JSON.stringify(cursoMini));
    this.router.navigate(['/profesor/detalle-curso', bloque.cursoId]);
  }

  imprimir(): void { window.print(); }
}