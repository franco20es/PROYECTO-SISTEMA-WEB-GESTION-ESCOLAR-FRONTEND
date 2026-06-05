// horario-docente.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment'; 
 
@Injectable({ providedIn: 'root' })
export class HorarioDocenteService {
 
  private http = inject(HttpClient);
  private api  = environment.apiUrl;
 
  // Horario del docente autenticado
  miHorario(anio: number): Observable<any[]> {
    const params = new HttpParams().set('anioAcademico', anio);
    return this.http.get<any[]>(`${this.api}/horarios/mi-horario`, { params });
  }
}
 