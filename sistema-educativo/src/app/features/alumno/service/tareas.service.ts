// tarea.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class TareaService {

  private http = inject(HttpClient);
  private api  = environment.apiUrl;

  // Lista las tareas del curso con el estado de MI entrega
  misTareas(cursoId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/tareas/curso/${cursoId}/mis-tareas`);
  }

  // Entregar tarea (archivo + comentario)
  entregar(tareaId: string, archivo: File, comentario: string): Observable<any> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    if (comentario) formData.append('comentario', comentario);
    return this.http.post<any>(`${this.api}/tareas/${tareaId}/entregar`, formData);
  }
}