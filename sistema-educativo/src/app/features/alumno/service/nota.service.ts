// nota.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class NotaService {

  private http = inject(HttpClient);
  private api  = environment.apiUrl;

  // Periodo activo (bimestre actual)
  getPeriodoActivo(): Observable<any> {
    return this.http.get<any>(`${this.api}/periodos/activo`);
  }

  // Horario del alumno (datos de cursos)
  getHorario(anio: number): Observable<any[]> {
    const params = new HttpParams().set('anio', anio);
    return this.http.get<any[]>(`${this.api}/portal/alumno/horario`, { params });
  }

  // Evaluaciones (componentes + notas) de un curso en un periodo
  getEvaluaciones(cursoId: string, periodoId: string, anio: number): Observable<any> {
    return this.http.get<any>(
      `${this.api}/evaluaciones/curso/${cursoId}/periodo/${periodoId}?anio=${anio}`
    );
  }
}