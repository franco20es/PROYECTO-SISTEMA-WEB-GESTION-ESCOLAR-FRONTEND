// contenido.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class ContenidoService {

  private http = inject(HttpClient);
  private api  = environment.apiUrl;

  // Listar semanas del curso (con sus materiales)
  listarSemanas(cursoId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/contenido/curso/${cursoId}/semanas`);
  }

  // Ver material (blob, nueva pestaña)
  verMaterial(materialId: string): Observable<Blob> {
    return this.http.get(`${this.api}/contenido/materiales/${materialId}/ver`, {
      responseType: 'blob'
    });
  }

  // Descargar material (blob)
  descargarMaterial(materialId: string): Observable<Blob> {
    return this.http.get(`${this.api}/contenido/materiales/${materialId}/descargar`, {
      responseType: 'blob'
    });
  }
}