// notificacion-navbar.service.ts
// Servicio ligero para el contador de la campanita (sirve para alumno y docente)
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environment/environment'; // ajusta la ruta

@Injectable({ providedIn: 'root' })
export class NotificacionNavbarService {

  private http = inject(HttpClient);
  private api  = environment.apiUrl;

  // Signal global del contador de no leídas
  noLeidas = signal<number>(0);

  // Consulta el backend y actualiza el signal
  refrescar(): void {
    this.http.get<{ noLeidas: number }>(`${this.api}/notificaciones/no-leidas`).subscribe({
      next: (res) => this.noLeidas.set(res?.noLeidas || 0),
      error: () => this.noLeidas.set(0)
    });
  }

  // Para poner el contador a 0 al instante (ej. tras marcar todas)
  resetear(): void {
    this.noLeidas.set(0);
  }
}