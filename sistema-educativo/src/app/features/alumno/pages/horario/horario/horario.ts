

declare global {
  interface Window {
    jspdf: any;
  }
}
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SpinnerComponent } from '../../../../../core/components/spiner/spiner/spiner';


import jsPDF from 'jspdf';


interface HorarioAlumno {
  curso: string;
  docente: string;
  seccion: string;
  vecesDesaprobado: number;
  HorasSemanales: number;
  Creditos: number;
  Grado: string;
}
@Component({
  selector: 'app-horario',
  standalone: true,
  imports: [CommonModule,SpinnerComponent],
  templateUrl: './horario.html',
  styleUrl: './horario.css',
})

export class Horario implements OnInit {

  cargandoDatos: boolean = true;
 horario: HorarioAlumno[] = [
    {
      curso: 'S01 - Arquitectura de Microservicios',
      docente: 'Ing. Carlos Rodríguez',
      seccion: '43082 - Lunes 08:30 am a 10:45 am',
      vecesDesaprobado: 0,
      HorasSemanales: 3,
      Creditos: 4,
      Grado: 'Séptimo'
    },
    {
      curso: 'S02 - Desarrollo Web Integrado',
      docente: 'Mag. makanki Joel Donayre',
      seccion: '47164 - Martes 18:30 pm a 21:00 pm',
      vecesDesaprobado: 0,
      HorasSemanales: 4,
      Creditos: 3,
      Grado: 'Séptimo'
    },
    {
      curso: 'S03 - Seguridad Informática',
      docente: 'Dr. Alejandro Gallardo',
      seccion: '18456 - Miércoles 07:30 am a 09:45 am',
      vecesDesaprobado: 0,
      HorasSemanales: 3,
      Creditos: 3,
      Grado: 'Séptimo'
    },
    {
      curso: 'S04 - Inteligencia de Negocios',
      docente: 'Ing. Gonzalo Ortiz',
      seccion: '47166 - Jueves 14:00 pm a 16:30 pm',
      vecesDesaprobado: 0,
      HorasSemanales: 3,
      Creditos: 3,
      Grado: 'Séptimo'
    },
    {
      curso: 'S05 - Gestión de Proyectos TI',
      docente: 'Mag. Francy Pazos',
      seccion: '18390 - Viernes 10:00 am a 12:15 pm',
      vecesDesaprobado: 1,
      HorasSemanales: 3,
      Creditos: 4,
      Grado: 'Séptimo'
    },
    {
      curso: 'S06 - Taller de Base de Datos (Redis/Postgres)',
      docente: 'Ing. Claudio Ibarra',
      seccion: '52441 - Sábado 15:00 pm a 18:00 pm',
      vecesDesaprobado: 0,
      HorasSemanales: 4,
      Creditos: 3,
      Grado: 'Séptimo'
    },
    {
      curso: 'S07 - Ética y Liderazgo Profesional',
      docente: 'Dra. Mercedes Cherres',
      seccion: '18411 - Sábado 08:00 am a 10:15 am',
      vecesDesaprobado: 0,
      HorasSemanales: 2,
      Creditos: 2,
      Grado: 'Séptimo'
    }
  ];
  totalHoras: number = 0;
  totalCreditos: number = 0;

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    this.calcularTotales();
  }

  ngOnInit(): void {
    // Implementación inicial de OnInit
    console.log('Componente Horario inicializado');

    setTimeout(() => {
      this.cargandoDatos = false;

      this.changeDetectorRef.detectChanges(); // Asegura que Angular detecte el cambio de estado
    }, 700); // Simula una carga de datos de 2 segundos
  }

  calcularTotales() {
    this.totalHoras = this.horario.reduce((total, item) => total + item.HorasSemanales, 0);
    this.totalCreditos = this.horario.reduce((total, item) => total + item.Creditos, 0);
  }

  descargarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('p', 'mm', 'a4'); // Orientación vertical

  // --- CONFIGURACIÓN DE COLORES (Basado en la imagen) ---
  const rojoUTP = [191, 13, 62];
  const azulHeader = [234, 244, 250]; // Azul muy claro para cabeceras

  // --- 1. LOGO Y ENCABEZADO ---
  // Si tienes el logo en Base64, descomenta la siguiente línea:
  // doc.addImage(imgData, 'PNG', 14, 10, 40, 12); 
  
  // Texto representativo del logo si no tienes la imagen a mano:
  doc.setFont("helvetica", "bold");
  doc.setTextColor(rojoUTP[0], rojoUTP[1], rojoUTP[2]);
  doc.setFontSize(22);
  doc.text("UTP", 14, 20); 
  doc.setFontSize(8);
  doc.text("Universidad\nTecnológica\ndel Perú", 32, 17);

  // --- 2. DATOS DEL ALUMNO (Izquierda y Derecha) ---
  doc.setTextColor(0);
  doc.setFontSize(12);
  doc.text("Horario de clase", 14, 35);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  
  // Bloque Izquierdo
  doc.text(`Alumno: U13206542 - JAN MARCO LOPEZ`, 14, 42);
  doc.text(`Carrera: PST50`, 14, 46);
  doc.text(`Campus: ICA`, 14, 50);
  doc.text(`Periodo: 2026 - Ciclo 1 Marzo`, 14, 54);

  // Bloque Derecho (Fecha y Hora)
  const ahora = new Date();
  doc.text(`Fecha: ${ahora.toLocaleDateString()}`, 150, 42);
  doc.text(`Hora: ${ahora.toLocaleTimeString()}`, 150, 46);

  // --- 3. TABLA DE CURSOS ---
  const columnas = [
    "Curso", "Docente", "Sección - Horario", "Veces\ndesap.", "Horas\nsemanales", "Créditos", "Ciclo", "Ubicación"
  ];

  const filas = this.horario.map(h => [
    h.curso,
    h.docente,
    `${h.seccion} - ${h.HorasSemanales}`, // Ajustar según tu lógica de horario
    h.vecesDesaprobado || 0,
    h.HorasSemanales,
    h.Creditos,
    h.Grado || '07', // Usando 07 como ejemplo de tu ciclo actual
    'UTP+clase'
  ]);

  doc.autoTable({
    startY: 60,
    head: [columnas],
    body: filas,
    theme: 'plain', // Estilo limpio sin bordes pesados
    headStyles: { 
      fillColor: azulHeader, 
      textColor: [80, 80, 80], 
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'left'
    },
    bodyStyles: { 
      fontSize: 8,
      textColor: [50, 50, 50],
      cellPadding: 4
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 35 }, // Columna Curso
      2: { cellWidth: 40 } // Columna Horario
    },
    didDrawCell: (data: any) => {
      // Dibujar línea inferior sutil en cada fila (como en la imagen)
      if (data.section === 'body') {
        doc.setDrawColor(230, 230, 230);
        doc.line(data.cell.x, data.cell.y + data.cell.height, data.cell.x + data.cell.width, data.cell.y + data.cell.height);
      }
    }
  });

  // --- 4. RESUMEN FINAL ---
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(8);
  doc.text(`Total de cursos: ${this.horario.length}`, 14, finalY);
  doc.text(`Total de horas semanales: ${this.totalHoras}`, 14, finalY + 4);
  doc.text(`Total de créditos: ${this.totalCreditos}`, 14, finalY + 8);

  // Pie de página
  doc.setFontSize(7);
  doc.text("Secretaría Académica", 14, 285);
  doc.text("UTP - Gerencia de sistemas", 150, 285);

  // --- 5. DESCARGA ---
  doc.save('Horario_UTP_JANMARCOLOPEZ.pdf');
}
}

