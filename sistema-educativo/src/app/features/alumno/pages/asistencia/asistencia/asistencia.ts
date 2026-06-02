import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ModalAsistencia } from '../../../components/modales/modal-asistencia/modal-asistencia';

export interface Curso {
  id: number;
  name: string;
  color: string;
  prof: string;
  hor: string;
  sec: string;
  total: number;
  p: number; // Presencias
  t: number; // Tardanzas
  f: number; // Faltas
  j: number; // Justificados
}

export interface MesResumen {
  nm: string;
  p: number;
  t: number;
  f: number;
  j: number;
  total: number;
}

export interface HistorialItem {
  fecha: string;
  dia: string;
  hora: string;
  mes: string;
  sem: number;
  estado: 'P' | 'T' | 'F' | 'J';
  obs: string;
}

@Component({
  selector: 'app-asistencia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'asistencia.html',
  styleUrls: ['asistencia.css']
})
export class AsistenciaAlumno implements OnInit {
  // Datos Estáticos
  CURSOS: Curso[] = [
    { id: 1, name: 'Matemáticas', color: '#2A63E6', prof: 'Prof. Mendoza', hor: 'Lun/Mié 7:30', sec: '3ro A', total: 24, p: 21, t: 1, f: 1, j: 1 },
    { id: 2, name: 'Comunicación', color: '#FF5B1F', prof: 'Prof. García', hor: 'Mar/Jue 8:30', sec: '3ro A', total: 22, p: 20, t: 1, f: 1, j: 0 },
    { id: 3, name: 'Ciencia y Tecnología', color: '#00C27C', prof: 'Prof. Ríos', hor: 'Lun/Vie 10:00', sec: '3ro A', total: 20, p: 18, t: 0, f: 1, j: 1 },
    { id: 4, name: 'Historia y Geografía', color: '#9B59B6', prof: 'Prof. Vargas', hor: 'Mié/Vie 8:30', sec: '3ro A', total: 22, p: 19, t: 2, f: 1, j: 0 },
    { id: 5, name: 'Inglés', color: '#F5A623', prof: 'Prof. Torres', hor: 'Mar/Jue 10:00', sec: '3ro A', total: 22, p: 22, t: 0, f: 0, j: 0 },
    { id: 6, name: 'Educación Física', color: '#E53030', prof: 'Prof. López', hor: 'Vie 11:00', sec: '3ro A', total: 10, p: 9, t: 1, f: 0, j: 0 }
  ];

  DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  MESES: MesResumen[] = [
    { nm: 'Marzo', p: 18, t: 1, f: 1, j: 0, total: 20 },
    { nm: 'Abril', p: 20, t: 1, f: 0, j: 1, total: 22 },
    { nm: 'Mayo', p: 10, t: 0, f: 0, j: 0, total: 10 }
  ];

  // Variables de Estado de la UI
  activeCurso: Curso | null = null;
  activeTab: number = 0;
  historialActiveCurso: HistorialItem[] = [];
  calData: { [day: number]: string } = {};
  
  // Variables de Resumen General
  totalP = 0; totalT = 0; totalF = 0; totalJ = 0; totalAll = 0; gPct = 0;
  
  // Días del calendario (Mayo 2025 ficticio del HTML original)
  prevMonthDays = [28, 29, 30];
  currentMonthDays = Array.from({ length: 31 }, (_, i) => i + 1);
  nextMonthDays = [1];

  ngOnInit() {
    this.calcularResumenGeneral();
  }

  // Cálculos Auxiliares
  pct(p: number, total: number): number {
    return total ? Math.round((p / total) * 100) : 0;
  }

  pctColor(v: number): string {
    return v >= 90 ? 'var(--ok)' : v >= 75 ? 'var(--wa)' : 'var(--er)';
  }

  ringDash(pct: number, r: number): string {
    const c = 2 * Math.PI * r;
    return `${(c * pct) / 100} ${(c * (100 - pct)) / 100}`;
  }

  private rndState(): 'P' | 'T' | 'F' | 'J' {
    const r = Math.random();
    return r < .84 ? 'P' : r < .92 ? 'T' : r < .97 ? 'F' : 'J';
  }

  calcularResumenGeneral() {
    this.CURSOS.forEach(c => {
      this.totalP += c.p; this.totalT += c.t;
      this.totalF += c.f; this.totalJ += c.j;
      this.totalAll += c.total;
    });
    this.gPct = this.pct(this.totalP, this.totalAll);
  }

  // Generador de historial (Lógica replicada de tu JS original)
  genHistorial(curso: Curso): HistorialItem[] {
    const fechas: any[] = [];
    const startDay = 3;
    const months = [{ m: 'Mar', days: 29 }, { m: 'Abr', days: 30 }, { m: 'May', days: 12 }];
    let d = startDay;

    months.forEach(mo => {
      while (d <= mo.days) {
        const monthIdx = mo.m === 'Mar' ? 2 : mo.m === 'Abr' ? 3 : 4;
        const dow = new Date(2025, monthIdx, d).getDay();
        if (dow >= 1 && dow <= 5) {
          fechas.push({
            fecha: `${String(d).padStart(2, '0')}/${mo.m === 'Mar' ? '03' : mo.m === 'Abr' ? '04' : '05'}/2025`,
            dia: this.DIAS[dow - 1],
            hora: curso.hor.split(' ')[1] || '7:30',
            mes: mo.m,
            sem: Math.ceil(d / 7)
          });
        }
        d += 1;
      }
      d = 1;
    });

    return fechas.map(f => {
      const st = this.rndState();
      const obs = st === 'T' ? 'Llegó 10 min tarde' : st === 'F' ? '' : st === 'J' ? 'Certificado médico' : '';
      return { ...f, estado: st, obs };
    });
  }

  // Acciones de la Vista
  openCurso(curso: Curso) {
    this.activeCurso = curso;
    this.activeTab = 0; // Resetear a la primera pestaña
    this.historialActiveCurso = this.genHistorial(curso);

    // Mapear datos para el calendario del mes de Mayo (05)
    this.calData = {};
    this.historialActiveCurso.forEach(h => {
      const parts = h.fecha.split('/');
      if (parts[1] === '05') {
        this.calData[parseInt(parts[0])] = h.estado;
      }
    });

    // Scroll Suave al Detalle
    setTimeout(() => {
      document.getElementById('detail')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }

  closeDetail() {
    this.activeCurso = null;
  }

  swDt(tabIndex: number) {
    this.activeTab = tabIndex;
  }
}