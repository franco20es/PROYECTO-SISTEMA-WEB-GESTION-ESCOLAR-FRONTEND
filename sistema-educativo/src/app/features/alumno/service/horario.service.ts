// horario.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class HorarioService {

  private http = inject(HttpClient);
  private api  = environment.apiUrl;

  getMiHorario(anio: number): Observable<any[]> {
    const params = new HttpParams().set('anio', anio);
    return this.http.get<any[]>(`${this.api}/portal/alumno/horario`, { params });
  }
}