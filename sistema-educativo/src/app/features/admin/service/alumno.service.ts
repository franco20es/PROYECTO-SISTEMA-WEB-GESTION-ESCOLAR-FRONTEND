// alumno.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class AlumnoService {

  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/alumnos`;

  // ─── Listar paginado ───────────────────────────────────────
  listarAlumnosPaginados(pagina = 0, tamano = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', pagina)
      .set('size', tamano)
      .set('sort', 'apellidos,asc');
    return this.http.get<any>(this.baseUrl, { params });
  }

  // ─── Buscar ────────────────────────────────────────────────
 buscarAlumnos(term: string, pagina = 0, tamano = 10): Observable<any> {
  const params = new HttpParams()
    .set('term', term)  // ← coincide con @RequestParam String term
    .set('page', pagina)
    .set('size', tamano);
  return this.http.get<any>(`${this.baseUrl}/buscar`, { params });
}
  // ─── Obtener por ID ────────────────────────────────────────
  obtenerPorId(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  // ─── Crear ─────────────────────────────────────────────────
  crearAlumno(alumno: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, alumno);
  }

  // ─── Actualizar ────────────────────────────────────────────
  actualizarAlumno(id: string, alumno: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, alumno);
  }

  // ─── Desactivar ────────────────────────────────────────────
  eliminarAlumno(id: string): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/${id}/desactivar`, {});
  }

  // ─── Exportar Excel ────────────────────────────────────────
  exportarExcel(): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/reportes/alumnos`, {
      responseType: 'blob'
    });
  }
// alumno.service.ts
listarConFiltros(estado?: string, term?: string, pagina = 0, tamano = 10): Observable<any> {
  let params = new HttpParams()
    .set('page', pagina)
    .set('size', tamano)
    .set('sort', 'apellidos,asc');

  // ← Solo agregar si tienen valor real
  if (estado && estado.trim()) params = params.set('estado', estado);
  if (term && term.trim())     params = params.set('term', term);

  return this.http.get<any>(`${this.baseUrl}/filtros`, { params });
}

// alumno.service.ts
// alumno.service.ts — método corregido
listarConMatricula(estado?: string, term?: string, anio?: number, pagina = 0, tamano = 10) {
  let params = new HttpParams()
    .set('page', pagina)
    .set('size', tamano);
    // ← sin sort

  if (estado && estado.trim()) params = params.set('estado', estado);
  if (term && term.trim())     params = params.set('term', term);
  if (anio)                    params = params.set('anio', anio);

  return this.http.get<any>(`${this.baseUrl}/con-matricula`, { params });
}

obtenerKpis(anio?: number): Observable<any> {
  let params = new HttpParams();
  if (anio) params = params.set('anio', anio);
  return this.http.get<any>(`${this.baseUrl}/kpis`, { params });
}

}