// contenido-docente.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class ContenidoDocenteService {

  private http = inject(HttpClient);
  private api  = environment.apiUrl;

  // Listar semanas del curso (con materiales)
  listarSemanas(cursoId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/contenido/curso/${cursoId}/semanas`);
  }

  // Crear semana
  crearSemana(cursoId: string, body: { numero: number; titulo: string }): Observable<any> {
    return this.http.post<any>(`${this.api}/contenido/curso/${cursoId}/semanas`, body);
  }

  // Eliminar semana
  eliminarSemana(semanaId: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/contenido/semanas/${semanaId}`);
  }

  // Subir archivo a una semana (form-data: archivo File + tipo Text)
  subirArchivo(semanaId: string, archivo: File, tipo: string): Observable<any> {
    const form = new FormData();
    form.append('archivo', archivo);
    form.append('tipo', tipo);
    return this.http.post<any>(`${this.api}/contenido/semanas/${semanaId}/archivo`, form);
  }

  // Agregar link a una semana
  agregarLink(semanaId: string, body: { nombre: string; url: string }): Observable<any> {
    return this.http.post<any>(`${this.api}/contenido/semanas/${semanaId}/link`, body);
  }

  // Eliminar material
  eliminarMaterial(materialId: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/contenido/materiales/${materialId}`);
  }
}