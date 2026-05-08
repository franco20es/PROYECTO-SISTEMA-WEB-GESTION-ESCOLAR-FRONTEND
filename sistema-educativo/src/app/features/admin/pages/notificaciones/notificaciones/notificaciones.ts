import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Toast } from '../../../../../core/components/toast/toast/toast';
import { ToastService } from '../../../../../core/services/toast/toast.service';

interface DestinatarioTag {
  av: string;
  color: string;
  name: string;
  s: 'ok' | 'pend' | 'fal';
}

interface DetalleNotificacion {
  type: string;
  title: string;
  fecha: string;
  dest: string;
  tags: DestinatarioTag[];
  channels: string[];
  ent: number;
  lei: number;
  pen: number;
  fal: number;
  msg: string;
}

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  imports: [CommonModule, Toast],
  templateUrl: './notificaciones.html',
  styleUrl: './notificaciones.css',
})
export class Notificaciones {
  detalleActual: DetalleNotificacion | null = null;
  mostrarDetallePanel = false;
  itemSeleccionado: HTMLElement | null = null;

  private detallesData: Record<string, DetalleNotificacion> = {
    mat: {
      type: 'Solicitud de Matrícula',
      title: 'Nueva solicitud de matrícula recibida',
      fecha: '02 May 2025 · 09:14',
      dest: '1 destinatario (administración)',
      tags: [
        { av: 'CF', color: '#0A1A3E', name: 'Lic. Carmen Flores', s: 'ok' },
        { av: 'AS', color: '#1340A0', name: 'Ana Soto', s: 'ok' },
      ],
      channels: ['email', 'panel'],
      ent: 2,
      lei: 1,
      pen: 0,
      fal: 0,
      msg: '<strong>Nueva solicitud de matrícula</strong> recibida a través del formulario de contacto del sitio web.<br><br>📋 <strong>Apoderado:</strong> María Elena García Quispe<br>📧 <strong>Email:</strong> garcia.maria@gmail.com<br>📱 <strong>Celular:</strong> 987 321 456<br>🎓 <strong>Nivel solicitado:</strong> 2° Grado — Primaria<br>👦 <strong>Nombre del alumno:</strong> Carlos Andrés García Quispe<br><br>La solicitud ha sido registrada con el código <strong>SOL-0021</strong>. Ingresa al módulo de Solicitudes Online para tramitar la matrícula.',
    },
    asist: {
      type: 'Alerta de Inasistencia',
      title: 'Alerta crítica de inasistencias — 4 alumnos',
      fecha: '02 May 2025 · 08:30',
      dest: '4 apoderados notificados',
      tags: [
        { av: 'MG', color: '#FF5B1F', name: 'García Quispe, M.', s: 'ok' },
        { av: 'DM', color: '#4A5470', name: 'Morales Díaz, D.', s: 'ok' },
        { av: 'KT', color: '#1340A0', name: 'Torres Huanca, K.', s: 'pend' },
        { av: '+1', color: '#8A95B0', name: '1 más', s: 'pend' },
      ],
      channels: ['whatsapp', 'email'],
      ent: 3,
      lei: 2,
      pen: 1,
      fal: 0,
      msg: 'Estimado/a apoderado/a:<br><br>Le comunicamos que su hijo/a ha acumulado un número de inasistencias que <strong>supera el límite permitido (30%)</strong>. Esta situación puede comprometer la promoción al siguiente grado.<br><br>⚠️ Inasistencias registradas: <strong>28 de 66 días</strong> (42%)<br>📅 Último período evaluado: Enero — Mayo 2025<br><br>Le solicitamos acercarse a la institución para coordinar con el docente tutor a la brevedad posible.<br><br>Atentamente, IE San Marcos.',
    },
    pago: {
      type: 'Confirmación de Pago',
      title: 'Pago confirmado — Recibo generado',
      fecha: '02 May 2025 · 08:05',
      dest: 'Andrés Quispe (apoderado)',
      tags: [{ av: 'AQ', color: '#007a4d', name: 'Andrés Quispe', s: 'ok' }],
      channels: ['email'],
      ent: 1,
      lei: 1,
      pen: 0,
      fal: 0,
      msg: 'Estimado Sr. Andrés Quispe:<br><br>✅ Confirmamos la recepción del pago correspondiente a:<br><br>📚 <strong>Alumno:</strong> Quispe Tello, Sofía Valentina<br>🎓 <strong>Grado:</strong> 5° Grado A — Primaria<br>💳 <strong>Concepto:</strong> Pensión mensual — Mayo 2025<br>💰 <strong>Monto pagado:</strong> S/ 230.00<br>📄 <strong>N° de recibo:</strong> REC-2025-0140<br>📅 <strong>Fecha:</strong> 01/05/2025<br><br>Puede descargar su recibo ingresando al portal de padres o solicitándolo en secretaría.<br><br>Gracias por su puntualidad. IE San Marcos.',
    },
  };

  constructor(private toastService: ToastService) {}

  showToast(msg: string, type: string = 'info') {
    this.toastService.show(msg, type);
  }

  /**
   * Muestra el detalle de una notificación
   * @param event Evento del click
   * @param categoria Categoría de la notificación (mat, asist, pago, etc)
   */
  mostrarDetalle(event: MouseEvent, categoria: string): void {
    const itemElement = (event.currentTarget as HTMLElement).closest('.notif-item') as HTMLElement;
    
    // Remover selección anterior
    if (this.itemSeleccionado) {
      this.itemSeleccionado.classList.remove('selected');
    }
    
    // Seleccionar nuevo item
    itemElement?.classList.add('selected');
    itemElement?.classList.remove('unread');
    const niDot = itemElement?.querySelector('.ni-dot') as HTMLElement;
    if (niDot) niDot.style.display = 'none';
    
    this.itemSeleccionado = itemElement;
    
    // Cargar detalle
    this.detalleActual = this.detallesData[categoria] || this.detallesData['mat'];
    this.mostrarDetallePanel = true;
  }

  /**
   * Obtiene el HTML de canales de notificación
   */
  obtenerCanalIcon(canal: string): string {
    const iconos: Record<string, string> = {
      email: '<svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/></svg>',
      whatsapp: '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>',
      sms: '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>',
      panel: '<svg viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2z"/></svg>',
    };
    return iconos[canal] || '';
  }

  /**
   * Obtiene el nombre del canal
   */
  obtenerCanalNombre(canal: string): string {
    const nombres: Record<string, string> = {
      email: 'Correo electrónico',
      whatsapp: 'WhatsApp Business',
      sms: 'SMS',
      panel: 'Panel admin',
    };
    return nombres[canal] || canal;
  }

  // funccion para cargar plantilla
  cargarPlantilla(plantillaId: string) {}
}
