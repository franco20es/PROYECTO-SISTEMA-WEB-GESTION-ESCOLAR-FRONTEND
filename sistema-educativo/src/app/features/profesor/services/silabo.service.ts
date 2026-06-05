// silabo-docente.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class SilaboDocenteService {

  private http = inject(HttpClient);
  private api  = environment.apiUrl;

  // Sílabo actual del curso (puede no existir)
  getPorCurso(cursoId: string): Observable<any> {
    return this.http.get<any>(`${this.api}/silabos/curso/${cursoId}`);
  }

  // Subir / reemplazar el sílabo (PDF)
  subir(cursoId: string, archivo: File): Observable<any> {
    const form = new FormData();
    form.append('archivo', archivo);
    return this.http.post<any>(`${this.api}/silabos/${cursoId}`, form);
  }

  // Eliminar el sílabo del curso
  eliminar(cursoId: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/silabos/curso/${cursoId}`);
  }

  // Descargar (blob, por JWT)
  descargar(silaboId: string): Observable<Blob> {
    return this.http.get(`${this.api}/silabos/${silaboId}/descargar`, { responseType: 'blob' });
  }

  // Ver inline (blob)
  ver(silaboId: string): Observable<Blob> {
    return this.http.get(`${this.api}/silabos/${silaboId}/ver`, { responseType: 'blob' });
  }
}