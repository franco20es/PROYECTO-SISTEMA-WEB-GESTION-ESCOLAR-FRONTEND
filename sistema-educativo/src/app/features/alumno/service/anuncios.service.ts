// anuncio.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class AnuncioService {

  private http = inject(HttpClient);
  private api  = environment.apiUrl;

  // Anuncios del curso (fijados primero, luego por fecha)
  listarPorCurso(cursoId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/anuncios/curso/${cursoId}`);
  }
}