import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirmacion-matricula',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmacion-matricula.html',
  styleUrl: './confirmacion-matricula.css',
})
export class ConfirmacionMatricula {

    @Input() showModal = false;
  @Input() confirmacion: any = null;

  @Output() cerrar = new EventEmitter<void>();
  @Output() nueva = new EventEmitter<void>();

  closeModal() {
    this.cerrar.emit();
  }

  nuevaMatricula() {
    this.nueva.emit();
  }

  imprimir() {
    if (!this.confirmacion) return;

    const printWindow = window.open('', '_blank', 'width=900,height=600');
    if (printWindow) {
      const html = `
        <html>
          <head>
            <meta charset="UTF-8">
            <title>Confirmación de Matrícula</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { 
                font-family: 'Segoe UI', Arial, sans-serif; 
                padding: 30px; 
                background: #f5f5f5;
              }
              .container { 
                background: white; 
                padding: 30px; 
                border-radius: 8px;
                max-width: 800px;
                margin: 0 auto;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              }
              .header { 
                text-align: center; 
                border-bottom: 3px solid #bf0d3e; 
                padding-bottom: 15px;
                margin-bottom: 25px;
              }
              .header h1 { 
                color: #bf0d3e; 
                font-size: 28px;
                margin-bottom: 5px;
                text-align: center;
              }
              .header p { 
                color: #666; 
                font-size: 12px;
              }
              .section { 
                margin-bottom: 20px; 
              }
              .section-title { 
                background: #f0f0f0; 
                padding: 10px 15px; 
                font-weight: bold; 
                color: #333;
                border-left: 4px solid #bf0d3e;
                margin-bottom: 12px;
              }
              .row { 
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin-bottom: 10px;
              }
              .field { 
                padding: 8px 0;
                border-bottom: 1px solid #eee;
              }
              .label { 
                color: #666; 
                font-size: 11px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              }
              .value { 
                color: #000; 
                font-size: 14px;
                font-weight: 500;
                margin-top: 4px;
              }
              .footer { 
                text-align: center; 
                margin-top: 30px; 
                padding-top: 20px; 
                border-top: 2px solid #eee;
                color: #999;
                font-size: 10px;
              }
              .credentials-box {
                background: #f9f9f9;
                border: 1px solid #ddd;
                padding: 15px;
                border-radius: 4px;
                margin-top: 10px;
              }
              .credentials-box .field {
                border: none;
              }
              @media print {
                body { background: white; }
                .container { box-shadow: none; }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✓ Confirmación de Matrícula</h1>
                <p>Registrado correctamente en el sistema</p>
              </div>

              <div class="section">
                <div class="section-title">Datos del Alumno</div>
                <div class="row">
                  <div class="field">
                    <div class="label">Nombre</div>
                    <div class="value">${this.confirmacion.nombre || '-'}</div>
                  </div>
                  <div class="field">
                    <div class="label">DNI</div>
                    <div class="value">${this.confirmacion.dni || '-'}</div>
                  </div>
                </div>
              </div>

              <div class="section">
                <div class="section-title">Datos Académicos</div>
                <div class="row">
                  <div class="field">
                    <div class="label">Año</div>
                    <div class="value">${this.confirmacion.anio || '-'}</div>
                  </div>
                  <div class="field">
                    <div class="label">Nivel</div>
                    <div class="value">${this.confirmacion.nivel || '-'}</div>
                  </div>
                </div>
                <div class="row">
                  <div class="field">
                    <div class="label">Grado</div>
                    <div class="value">${this.confirmacion.grado || '-'}</div>
                  </div>
                  <div class="field">
                    <div class="label">Sección</div>
                    <div class="value">${this.confirmacion.seccion || '-'}</div>
                  </div>
                </div>
              </div>

              <div class="section">
                <div class="section-title">Credenciales de Acceso</div>
                <div class="credentials-box">
                  <div class="row">
                    <div class="field">
                      <div class="label">Usuario</div>
                      <div class="value" style="font-family: 'Courier New', monospace; font-weight: bold;">${this.confirmacion.usuario || '-'}</div>
                    </div>
                    <div class="field">
                      <div class="label">Contraseña</div>
                      <div class="value" style="font-family: 'Courier New', monospace; font-weight: bold;">${this.confirmacion.contrasena || '-'}</div>
                    </div>
                  </div>
                  <div class="field" style="margin-top: 10px;">
                    <div class="label">Código de Matrícula</div>
                    <div class="value" style="font-family: 'Courier New', monospace; font-weight: bold; color: #bf0d3e;">${this.confirmacion.codigo || '-'}</div>
                  </div>
                </div>
              </div>

              <div class="footer">
                <p>Impreso el: ${new Date().toLocaleString()}</p>
                <p style="margin-top: 8px;">Conserve este documento para sus registros</p>
              </div>
            </div>
          </body>
        </html>
      `;
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  }

  descargarPDF() {
    if (!this.confirmacion) return;

    const { jsPDF } = (window as any).jspdf;
    if (!jsPDF) {
      console.error('jsPDF no está cargado. Asegúrate de incluirlo en index.html');
      return;
    }

    const doc = new jsPDF('p', 'mm', 'a4');

    // --- CONFIGURACIÓN DE COLORES ---
    const rojoUTP = [191, 13, 62];
    const azulHeader = [234, 244, 250];
    const grisOscuro = [50, 50, 50];
    const grisClaro = [230, 230, 230];

    // --- 1. ENCABEZADO ---
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(rojoUTP[0], rojoUTP[1], rojoUTP[2]);
    doc.setFontSize(20);
    doc.text('CONFIRMACIÓN DE MATRÍCULA', 14, 20);

    // Línea divisoria
    doc.setDrawColor(rojoUTP[0], rojoUTP[1], rojoUTP[2]);
    doc.line(14, 25, 196, 25);

    // Fecha
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(grisOscuro[0], grisOscuro[1], grisOscuro[2]);
    const fechaActual = new Date();
    doc.text(`Fecha: ${fechaActual.toLocaleDateString('es-PE')}`, 14, 31);
    doc.text(`Hora: ${fechaActual.toLocaleTimeString('es-PE')}`, 14, 36);

    // --- 2. DATOS DEL ALUMNO ---
    let yPos = 45;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(rojoUTP[0], rojoUTP[1], rojoUTP[2]);
    doc.text('DATOS DEL ALUMNO', 14, yPos);
    yPos += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(grisOscuro[0], grisOscuro[1], grisOscuro[2]);

    // Bloque Izquierdo
    doc.text(`Nombre: ${this.confirmacion.nombre || '-'}`, 14, yPos);
    yPos += 6;
    doc.text(`DNI: ${this.confirmacion.dni || '-'}`, 14, yPos);
    yPos += 10;

    // --- 3. DATOS ACADÉMICOS ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(rojoUTP[0], rojoUTP[1], rojoUTP[2]);
    doc.text('DATOS ACADÉMICOS', 14, yPos);
    yPos += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(grisOscuro[0], grisOscuro[1], grisOscuro[2]);

    const datoAcademico = [
      { label: 'Año', value: this.confirmacion.anio || '-' },
      { label: 'Nivel', value: this.confirmacion.nivel || '-' },
      { label: 'Grado', value: this.confirmacion.grado || '-' },
      { label: 'Sección', value: this.confirmacion.seccion || '-' }
    ];

    let xPos = 14;
    let lineCount = 0;
    for (let i = 0; i < datoAcademico.length; i++) {
      const dato = datoAcademico[i];
      doc.text(`${dato.label}: ${dato.value}`, xPos, yPos);
      lineCount++;
      if (lineCount === 2) {
        xPos = 110;
        lineCount = 0;
      } else {
        yPos += 6;
        xPos = 14;
      }
    }
    yPos += 10;

    // --- 4. CREDENCIALES DE ACCESO ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(rojoUTP[0], rojoUTP[1], rojoUTP[2]);
    doc.text('CREDENCIALES DE ACCESO', 14, yPos);
    yPos += 8;

    // Rectángulo de fondo para credenciales
    doc.setFillColor(azulHeader[0], azulHeader[1], azulHeader[2]);
    doc.rect(14, yPos - 2, 182, 28, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(grisOscuro[0], grisOscuro[1], grisOscuro[2]);

    doc.text(`Usuario: ${this.confirmacion.usuario || '-'}`, 18, yPos + 3);
    doc.text(`Contraseña: ${this.confirmacion.contrasena || '-'}`, 18, yPos + 10);
    doc.text(`Código de Matrícula: ${this.confirmacion.codigo || '-'}`, 18, yPos + 17);

    yPos += 35;

    // --- 5. NOTA IMPORTANTE ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(rojoUTP[0], rojoUTP[1], rojoUTP[2]);
    doc.text('⚠ IMPORTANTE:', 14, yPos);
    yPos += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(grisOscuro[0], grisOscuro[1], grisOscuro[2]);
    doc.text('• Guarde sus credenciales en un lugar seguro', 18, yPos);
    yPos += 4;
    doc.text('• No comparta su contraseña con nadie', 18, yPos);
    yPos += 4;
    doc.text('• Podrá cambiar su contraseña desde el portal del estudiante', 18, yPos);

    // --- 6. PIE DE PÁGINA ---
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text('Sistema de Gestión Educativa', 14, pageHeight - 10);
    doc.text(`Generado: ${fechaActual.toLocaleString('es-PE')}`, 140, pageHeight - 10);

    // Línea inferior
    doc.setDrawColor(grisClaro[0], grisClaro[1], grisClaro[2]);
    doc.line(14, pageHeight - 5, 196, pageHeight - 5);

    // --- 7. DESCARGA ---
    const nombreArchivo = `Matricula_${this.confirmacion.codigo || 'documento'}_${fechaActual.getTime()}.pdf`;
    doc.save(nombreArchivo);
  }
}
