// silabo.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class SilaboService {

  private http = inject(HttpClient);
  private api  = environment.apiUrl;

  // Info del sílabo del curso
  getPorCurso(cursoId: string): Observable<any> {
    return this.http.get<any>(`${this.api}/silabos/curso/${cursoId}`);
  }

  // Ver el PDF (blob, abre en nueva pestaña con token)
  ver(silaboId: string): Observable<Blob> {
    return this.http.get(`${this.api}/silabos/${silaboId}/ver`, {
      responseType: 'blob'
    });
  }

  // Descargar el PDF (blob, fuerza descarga con token)
  descargar(silaboId: string): Observable<Blob> {
    return this.http.get(`${this.api}/silabos/${silaboId}/descargar`, {
      responseType: 'blob'
    });
  }
}