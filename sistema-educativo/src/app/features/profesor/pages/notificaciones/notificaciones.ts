import { Component, ChangeDetectionStrategy, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NotificacionDocenteService } from '../../services/notificaciones.service';

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notificaciones.html',
  styleUrl: './notificaciones.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Notificaciones implements OnInit {

  private notiService = inject(NotificacionDocenteService);
  private router      = inject(Router);

  cargando = signal(true);
  notificaciones = signal<any[]>([]);
  filtro = signal<'all' | 'unread'>('all');

  // Lista filtrada
  visibles = computed(() => {
    const lista = this.notificaciones();
    if (this.filtro() === 'unread') return lista.filter(n => !n.leida);
    return lista;
  });

  totalNoLeidas = computed(() => this.notificaciones().filter(n => !n.leida).length);
  total = computed(() => this.notificaciones().length);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.notiService.listar().subscribe({
      next: (data) => { this.notificaciones.set(data || []); this.cargando.set(false); },
      error: () => { this.notificaciones.set([]); this.cargando.set(false); }
    });
  }

  setFiltro(f: 'all' | 'unread'): void {
    this.filtro.set(f);
  }

  // Click en notificación: marca leída y navega
  abrir(noti: any): void {
    if (!noti.leida) {
      this.notiService.marcarLeida(noti.id).subscribe({
        next: () => {
          this.notificaciones.update(list =>
            list.map(n => n.id === noti.id ? { ...n, leida: true } : n));
        }
      });
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
      next: () => {
        this.notificaciones.update(list =>
          list.map(n => n.id === noti.id ? { ...n, leida: true } : n));
      }
    });
  }

  marcarTodas(): void {
    this.notiService.marcarTodasLeidas().subscribe({
      next: () => {
        this.notificaciones.update(list => list.map(n => ({ ...n, leida: true })));
      }
    });
  }

  // Ícono/color por tipo (usa tus clases de color del CSS)
  iconoFondo(tipo: string): string {
    const map: Record<string, string> = {
      ANUNCIO: 'rgba(42,99,230,.08)',
      TAREA:   'rgba(0,194,124,.08)',
      NOTA:    'rgba(245,166,35,.08)',
      EXAMEN:  'rgba(155,89,182,.08)',
      FORO:    'rgba(229,48,48,.08)'
    };
    return map[tipo] || 'rgba(138,149,176,.08)';
  }

  iconoColor(tipo: string): string {
    const map: Record<string, string> = {
      ANUNCIO: '#2A63E6', TAREA: '#00C27C', NOTA: '#F5A623',
      EXAMEN: '#9B59B6', FORO: '#E53030'
    };
    return map[tipo] || '#8A95B0';
  }

  etiquetaTipo(tipo: string): string {
    const map: Record<string, string> = {
      ANUNCIO: 'Anuncio', TAREA: 'Tarea', NOTA: 'Nota', EXAMEN: 'Examen', FORO: 'Foro'
    };
    return map[tipo] || tipo;
  }

  tiempoRelativo(fecha: string): string {
    if (!fecha) return '';
    const diff = Math.floor((Date.now() - new Date(fecha).getTime()) / 1000);
    if (diff < 60) return 'Hace un momento';
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} h`;
    if (diff < 604800) return `Hace ${Math.floor(diff / 86400)} d`;
    return new Date(fecha).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' });
  }
}