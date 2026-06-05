// evaluacion.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class EvaluacionService {

  private http = inject(HttpClient);
  private api  = environment.apiUrl;

  // Mis evaluaciones (componentes con notas) de un curso en un periodo
  misEvaluaciones(cursoId: string, periodoId: string, anio: number): Observable<any> {
    return this.http.get<any>(
      `${this.api}/evaluaciones/curso/${cursoId}/periodo/${periodoId}?anio=${anio}`
    );
  }

  // Bimestres del año ordenados (para el selector)
  getPeriodos(anio: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/periodos/anio/${anio}/ordenado`);
  }

  // Exámenes en línea publicados del curso
  getExamenes(cursoId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/examenes/curso/${cursoId}`);
  }
}