// notificaciones.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NotificacionService } from '../../../service/notificacion.service';

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notificaciones.html',
  styleUrl: './notificaciones.css',
})
export class NotificacionesAlumno implements OnInit {

  private notiService = inject(NotificacionService);
  private router      = inject(Router);

  cargando = true;
  notificaciones: any[] = [];
  filtro: 'all' | 'unread' = 'all';

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.notiService.listar().subscribe({
      next: (data) => {
        this.notificaciones = data || [];
        this.cargando = false;
      },
      error: () => {
        this.notificaciones = [];
        this.cargando = false;
      }
    });
  }

  // Lista filtrada
  get visibles(): any[] {
    if (this.filtro === 'unread') {
      return this.notificaciones.filter(n => !n.leida);
    }
    return this.notificaciones;
  }

  get totalNoLeidas(): number {
    return this.notificaciones.filter(n => !n.leida).length;
  }

  setFiltro(f: 'all' | 'unread'): void {
    this.filtro = f;
  }

  // Click en una notificación: marca leída y navega al enlace
abrir(noti: any): void {
  if (!noti.leida) {
    this.notiService.marcarLeida(noti.id).subscribe({ next: () => noti.leida = true });
  }
  if (noti.enlace) {
    const [ruta, query] = noti.enlace.split('?');
    if (query) {
      const params: any = {};
      query.split('&').forEach((par: string) => {
        const [k, v] = par.split('=');
        params[k] = v;
      });
      this.router.navigate([ruta], { queryParams: params });
    } else {
      this.router.navigate([ruta]);
    }
  }
}

  // Marcar una leída sin navegar (botón check)
  marcarLeida(noti: any, event: Event): void {
    event.stopPropagation();
    if (noti.leida) return;
    this.notiService.marcarLeida(noti.id).subscribe({
      next: () => { noti.leida = true; },
      error: () => {}
    });
  }

  marcarTodas(): void {
    this.notiService.marcarTodasLeidas().subscribe({
      next: () => {
        this.notificaciones.forEach(n => n.leida = true);
      },
      error: () => {}
    });
  }

  // Ícono y color según tipo
  iconoTipo(tipo: string): string {
    const map: Record<string, string> = {
      ANUNCIO: 'ti-speakerphone',
      TAREA:   'ti-checkbox',
      NOTA:    'ti-clipboard-check',
      EXAMEN:  'ti-device-laptop',
      FORO:    'ti-messages'
    };
    return map[tipo] || 'ti-bell';
  }

  colorTipo(tipo: string): string {
    const map: Record<string, string> = {
      ANUNCIO: '#FF5B1F',
      TAREA:   '#2A63E6',
      NOTA:    '#1D9E75',
      EXAMEN:  '#9B59B6',
      FORO:    '#1340A0'
    };
    return map[tipo] || '#64748B';
  }

  etiquetaTipo(tipo: string): string {
    const map: Record<string, string> = {
      ANUNCIO: 'Anuncio',
      TAREA:   'Tarea',
      NOTA:    'Nota',
      EXAMEN:  'Examen',
      FORO:    'Foro'
    };
    return map[tipo] || tipo;
  }

  tiempoRelativo(fecha: string): string {
    if (!fecha) return '';
    const ahora = new Date().getTime();
    const f = new Date(fecha).getTime();
    const diff = Math.floor((ahora - f) / 1000); // segundos

    if (diff < 60) return 'Hace un momento';
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} h`;
    if (diff < 604800) return `Hace ${Math.floor(diff / 86400)} d`;
    return new Date(fecha).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' });
  }
}