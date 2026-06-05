// curso-docente.service.ts
// Ubícalo en: profesor/services/curso-docente.service.ts (ajusta la ruta de environment)
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class CursoDocenteService {

  private http = inject(HttpClient);
  private api  = environment.apiUrl;

  // Cursos asignados al docente autenticado
  misCursos(anio: number): Observable<any[]> {
    const params = new HttpParams().set('anioAcademico', anio);
    return this.http.get<any[]>(`${this.api}/asignaciones/mis-cursos`, { params });
  }
}