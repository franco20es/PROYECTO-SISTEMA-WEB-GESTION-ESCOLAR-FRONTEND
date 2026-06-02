// pago.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class PagoService {

  private http = inject(HttpClient);
  private api = environment.apiUrl;

  // ─── Pensiones ────────────────────────────────────────────────────────────

  getPensiones(anio: number, page = 0, size = 12): Observable<any> {
    return this.http.get<any>(`${this.api}/portal/alumno/pensiones`, {
      params: { anio, page, size }
    });
  }

  // ─── MercadoPago ──────────────────────────────────────────────────────────

  crearPreferencia(referenciaId: string, tipo: 'PENSION' | 'MATRICULA'): Observable<any> {
    return this.http.post<any>(`${this.api}/pagos/crear-preferencia`, {
      referenciaId,
      tipo
    });
  }
}