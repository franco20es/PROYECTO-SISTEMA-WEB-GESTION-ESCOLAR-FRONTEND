// examen.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class ExamenService {

  private http = inject(HttpClient);
  private api  = environment.apiUrl;

  // Lista de exámenes publicados del curso (sin preguntas)
  listarDelCurso(cursoId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/examenes/curso/${cursoId}`);
  }

  // Abre el examen para rendirlo (con preguntas, sin respuestas correctas)
  rendir(examenId: string, anio: number): Observable<any> {
    return this.http.get<any>(`${this.api}/examenes/${examenId}/rendir?anio=${anio}`);
  }

  // Envía las respuestas
  entregar(examenId: string, anio: number, respuestas: any[]): Observable<any> {
    return this.http.post<any>(
      `${this.api}/examenes/${examenId}/entregar?anio=${anio}`,
      { respuestas }
    );
  }
}