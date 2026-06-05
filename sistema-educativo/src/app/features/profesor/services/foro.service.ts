// foro-docente.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class ForoDocenteService {

  private http = inject(HttpClient);
  private api  = environment.apiUrl;

  // Listar foros del curso
  listar(cursoId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/foros/curso/${cursoId}`);
  }

  // Crear foro
  crear(cursoId: string, body: { titulo: string; descripcion: string }): Observable<any> {
    return this.http.post<any>(`${this.api}/foros/curso/${cursoId}`, body);
  }

  // Eliminar foro
  eliminar(foroId: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/foros/${foroId}`);
  }

  // Abrir un foro con sus mensajes
  abrir(foroId: string): Observable<any> {
    return this.http.get<any>(`${this.api}/foros/${foroId}`);
  }

  // Publicar mensaje en un foro
  publicarMensaje(foroId: string, body: { contenido: string }): Observable<any> {
    return this.http.post<any>(`${this.api}/foros/${foroId}/mensajes`, body);
  }
}