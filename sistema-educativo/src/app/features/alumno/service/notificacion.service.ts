// notificacion.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class NotificacionService {

  private http = inject(HttpClient);
  private api  = environment.apiUrl;

  // Lista de mis notificaciones
  listar(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/notificaciones`);
  }

  // Contador de no leídas (para la campanita)
  contarNoLeidas(): Observable<{ noLeidas: number }> {
    return this.http.get<{ noLeidas: number }>(`${this.api}/notificaciones/no-leidas`);
  }

  // Marcar una como leída
  marcarLeida(id: string): Observable<void> {
    return this.http.patch<void>(`${this.api}/notificaciones/${id}/leida`, {});
  }

  // Marcar todas como leídas
  marcarTodasLeidas(): Observable<void> {
    return this.http.patch<void>(`${this.api}/notificaciones/leidas`, {});
  }
}