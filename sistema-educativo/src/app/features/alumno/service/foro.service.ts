// foro.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class ForoService {

  private http = inject(HttpClient);
  private api  = environment.apiUrl;

  // Lista los foros del curso (sin mensajes)
  listarForos(cursoId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/foros/curso/${cursoId}`);
  }

  // Abre un foro con todos sus mensajes (el hilo)
  abrirForo(foroId: string): Observable<any> {
    return this.http.get<any>(`${this.api}/foros/${foroId}`);
  }

  // Publica un mensaje en el foro
  publicarMensaje(foroId: string, cuerpo: string): Observable<any> {
    return this.http.post<any>(`${this.api}/foros/${foroId}/mensajes`, { cuerpo });
  }
}