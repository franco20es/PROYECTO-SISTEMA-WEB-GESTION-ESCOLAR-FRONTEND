// anuncio-docente.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class AnuncioDocenteService {

  private http = inject(HttpClient);
  private api  = environment.apiUrl;

  // Listar anuncios del curso
  listar(cursoId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/anuncios/curso/${cursoId}`);
  }

  // Crear anuncio (el docenteId sale del token en el backend)
  crear(cursoId: string, body: { titulo: string; cuerpo: string; fijado: boolean }): Observable<any> {
    return this.http.post<any>(`${this.api}/anuncios/curso/${cursoId}`, body);
  }

  // Eliminar anuncio
  eliminar(anuncioId: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/anuncios/${anuncioId}`);
  }
}