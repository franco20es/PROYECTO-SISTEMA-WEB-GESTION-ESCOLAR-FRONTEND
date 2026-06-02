// curso.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class CursoService {

  private http = inject(HttpClient);
  private api  = environment.apiUrl;

  // Horario — fuente de cursos del alumno
  getMiHorario(anio: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/portal/alumno/horario`, {
      params: new HttpParams().set('anio', anio)
    });
  }

  // Notas paginadas
  getMisNotas(anio: number, page = 0, size = 50): Observable<any> {
    return this.http.get<any>(`${this.api}/portal/alumno/notas`, {
      params: new HttpParams()
        .set('anio', anio)
        .set('page', page)
        .set('size', size)
    });
  }

  // Asistencias por rango de fechas
  getMisAsistencias(anio: number, inicio: string, fin: string): Observable<any> {
    return this.http.get<any>(`${this.api}/portal/alumno/asistencias`, {
      params: new HttpParams()
        .set('anio', anio)
        .set('inicio', inicio)
        .set('fin', fin)
    });
  }

  // Pensiones
  getMisPensiones(anio: number): Observable<any> {
    return this.http.get<any>(`${this.api}/portal/alumno/pensiones`, {
      params: new HttpParams().set('anio', anio)
    });
  }
}