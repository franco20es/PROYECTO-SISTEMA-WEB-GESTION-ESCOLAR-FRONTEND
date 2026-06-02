// horario.ts
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { SpinnerComponent } from '../../../../../core/components/spiner/spiner/spiner';
import { HorarioService } from '../../../service/horario.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
@Component({
  selector: 'app-horario',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './horario.html',
  styleUrl: './horario.css',
})
export class Horario implements OnInit {

  private horarioService = inject(HorarioService);
  private cdr            = inject(ChangeDetectorRef);

  cargandoDatos = true;
  anio          = new Date().getFullYear();
  horario: any[] = [];
  seccion   = '';
  error     = '';

  // Horas a mostrar (6am - 6pm)
  readonly START_HOUR = 6;
  readonly PX_PER_HOUR = 48;
  readonly horas = [6,7,8,9,10,11,12,13,14,15,16,17];
  readonly diasOrden = ['LUNES','MARTES','MIERCOLES','JUEVES','VIERNES','SABADO'];

  // Paleta de colores para cursos
  private readonly COLORS = [
    { bg:'#E6F1FB', border:'#378ADD', text:'#0C447C' },
    { bg:'#E1F5EE', border:'#1D9E75', text:'#085041' },
    { bg:'#FAEEDA', border:'#EF9F27', text:'#633806' },
    { bg:'#FBEAF0', border:'#D4537E', text:'#72243E' },
    { bg:'#EEEDFE', border:'#7F77DD', text:'#3C3489' },
    { bg:'#FAECE7', border:'#D85A30', text:'#712B13' },
    { bg:'#EAF3DE', border:'#639922', text:'#27500A' },
  ];
  private colorMap = new Map<string, { bg: string; border: string; text: string }>();
  private colorIdx = 0;

  ngOnInit(): void {
    this.cargarHorario();
  }

  cargarHorario(): void {
    this.cargandoDatos = true;
    this.horarioService.getMiHorario(this.anio).subscribe({
      next: (data) => {
        this.horario = data;
        if (data.length > 0) {
          this.seccion = data[0].seccionDenominacion;
          // Pre-asignar colores a todos los cursos
          this.cursosUnicos.forEach(c => this.getColor(c));
        }
        this.cargandoDatos = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'No se pudo cargar el horario.';
        this.cargandoDatos = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ─── Getters ──────────────────────────────────────────────────────────────

  get diasVisibles(): string[] {
    const dias = new Set(this.horario.map(h => h.diaSemana));
    return this.diasOrden.filter(d => dias.has(d));
  }

  get cursosUnicos(): string[] {
    return [...new Set(this.horario.map(h => h.cursoNombre))];
  }

  // ─── Helpers de calendario ────────────────────────────────────────────────

  getClasesEnHora(dia: string, hora: number): any[] {
    return this.horario.filter(h => {
      if (h.diaSemana !== dia) return false;
      const startH = parseInt(h.horaInicio.split(':')[0]);
      return startH === hora;
    });
  }

  calcularAltura(clase: any): number {
    const [sh, sm] = clase.horaInicio.split(':').map(Number);
    const [eh, em] = clase.horaFin.split(':').map(Number);
    const duracion = (eh * 60 + em) - (sh * 60 + sm);
    return (duracion / 60) * this.PX_PER_HOUR - 4;
  }

  calcularTop(clase: any, hora: number): number {
    const [, sm] = clase.horaInicio.split(':').map(Number);
    return (sm / 60) * this.PX_PER_HOUR + 2;
  }

  getColor(curso: string): { bg: string; border: string; text: string } {
    if (!this.colorMap.has(curso)) {
      this.colorMap.set(curso, this.COLORS[this.colorIdx++ % this.COLORS.length]);
    }
    return this.colorMap.get(curso)!;
  }

  // ─── Formateo ─────────────────────────────────────────────────────────────

  formatearDia(dia: string): string {
    const map: Record<string, string> = {
      LUNES: 'Lunes', MARTES: 'Martes', MIERCOLES: 'Miércoles',
      JUEVES: 'Jueves', VIERNES: 'Viernes', SABADO: 'Sábado'
    };
    return map[dia] || dia;
  }

  formatearHoraLabel(hora: number): string {
    return hora < 10 ? `0${hora}:00` : `${hora}:00`;
  }

  formatearHora(hora: string): string {
    if (!hora) return '';
    const [h, m] = hora.split(':').map(Number);
    const ampm = h >= 12 ? 'pm' : 'am';
    const h12  = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${h12}:${m.toString().padStart(2,'0')} ${ampm}`;
  }

  descargarPDF(): void {
  const doc = new jsPDF('l', 'mm', 'a4'); // landscape

  // Título
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('Horario de Clases', 14, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Periodo: ${this.anio}`, 14, 24);
  if (this.seccion) doc.text(this.seccion, 14, 29);

  // Fecha
  const ahora = new Date();
  doc.text(`Generado: ${ahora.toLocaleDateString('es-PE')} ${ahora.toLocaleTimeString('es-PE')}`, 200, 18);

  // Tabla
  const columnas = ['Día', 'Horario', 'Curso', 'Docente', 'Sección'];
  const filas = this.diasOrden
    .filter(dia => this.diasVisibles.includes(dia))
    .flatMap(dia =>
      this.horario
        .filter(h => h.diaSemana === dia)
        .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio))
        .map(h => [
          this.formatearDia(h.diaSemana),
          `${this.formatearHora(h.horaInicio)} - ${this.formatearHora(h.horaFin)}`,
          h.cursoNombre,
          h.docenteNombreCompleto,
          h.seccionDenominacion
        ])
    );

  autoTable(doc, {
    startY: 35,
    head: [columnas],
    body: filas,
    theme: 'plain',
    headStyles: {
      fillColor: [241, 245, 249],
      textColor: [51, 65, 85],
      fontStyle: 'bold',
      fontSize: 9
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [30, 41, 59]
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 25 },
      1: { cellWidth: 35 },
      2: { cellWidth: 45 },
      3: { cellWidth: 55 },
    },
    didDrawCell: (data: any) => {
      if (data.section === 'body') {
        doc.setDrawColor(226, 232, 240);
        doc.line(
          data.cell.x,
          data.cell.y + data.cell.height,
          data.cell.x + data.cell.width,
          data.cell.y + data.cell.height
        );
      }
    }
  });

  // Total
  const finalY = (doc as any).lastAutoTable.finalY + 8;
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Total: ${this.horario.length} sesión(es) · ${this.cursosUnicos.length} curso(s)`, 14, finalY);

  doc.save(`Horario_${this.anio}.pdf`);
}
}