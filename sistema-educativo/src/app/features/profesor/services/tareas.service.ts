// tarea-docente.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class TareaDocenteService {

  private http = inject(HttpClient);
  private api  = environment.apiUrl;

  // Listar tareas del curso (para el docente)
  listar(cursoId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/tareas/curso/${cursoId}`);
  }

  // Crear tarea
  crear(cursoId: string, body: { nombre: string; descripcion: string; fechaLimite: string; presencial: boolean }): Observable<any> {
    return this.http.post<any>(`${this.api}/tareas/curso/${cursoId}`, body);
  }

  // Eliminar tarea
  eliminar(tareaId: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/tareas/${tareaId}`);
  }

  // Ver entregas de una tarea
  entregas(tareaId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/tareas/${tareaId}/entregas`);
  }
}