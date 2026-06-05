// asistencia.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class AsistenciaService {

  private http = inject(HttpClient);
  private api  = environment.apiUrl;

  // Resumen de mi asistencia por curso
  miAsistencia(anio: number): Observable<any[]> {
    const params = new HttpParams().set('anio', anio);
    return this.http.get<any[]>(`${this.api}/asistencias/mi-asistencia`, { params });
  }

  // Detalle (historial) de un curso
  miAsistenciaCurso(cursoId: string, anio: number): Observable<any[]> {
    const params = new HttpParams().set('anio', anio);
    return this.http.get<any[]>(`${this.api}/asistencias/mi-asistencia/curso/${cursoId}`, { params });
  }
}