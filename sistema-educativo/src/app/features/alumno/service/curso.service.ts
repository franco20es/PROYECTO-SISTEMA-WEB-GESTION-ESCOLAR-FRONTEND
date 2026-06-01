import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CursoDetalle  } from "../models/curso.model";
import { EntregaTarea } from "../models/curso.model";
import { environment } from "../../../../environment/environment";
@Injectable({
  providedIn: 'root'
})
export class CursoService {
 private api = environment.apiUrl; // http://localhost:8080/api/v1
 
  constructor(private http: HttpClient) {}
 
  private headers(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
 
  // ─── Portal Alumno ────────────────────────────────────────────────────────
 
  // GET /api/v1/portal/alumno/cursos?anio=2026
  getMisCursos(anio: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/portal/alumno/cursos`, {
      headers: this.headers(),
      params: { anio: anio.toString() }
    });
  }
 
  // GET /api/v1/portal/alumno/cursos/{cursoId}/detalle?anio=2026&periodoId=xxx
  getDetalleCurso(cursoId: string, anio: number, periodoId: string): Observable<CursoDetalle> {
    return this.http.get<CursoDetalle>(
      `${this.api}/portal/alumno/cursos/${cursoId}/detalle`,
      {
        headers: this.headers(),
        params: { anio: anio.toString(), periodoId }
      }
    );
  }
 
  // GET /api/v1/portal/alumno/horario?anio=2026
  getMiHorario(anio: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/portal/alumno/horario`, {
      headers: this.headers(),
      params: { anio: anio.toString() }
    });
  }
 
  // GET /api/v1/portal/alumno/notas?anio=2026&periodoId=xxx
  getMisNotas(anio: number, periodoId?: string): Observable<any[]> {
    const params: any = { anio: anio.toString() };
    if (periodoId) params['periodoId'] = periodoId;
    return this.http.get<any[]>(`${this.api}/portal/alumno/notas`, {
      headers: this.headers(),
      params
    });
  }
 
  // GET /api/v1/portal/alumno/asistencias?anio=2026&inicio=...&fin=...
  getMisAsistencias(anio: number, inicio: string, fin: string): Observable<any> {
    return this.http.get(`${this.api}/portal/alumno/asistencias`, {
      headers: this.headers(),
      params: { anio: anio.toString(), inicio, fin }
    });
  }
 
  // GET /api/v1/portal/alumno/pensiones?anio=2026
  getMisPensiones(anio: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/portal/alumno/pensiones`, {
      headers: this.headers(),
      params: { anio: anio.toString() }
    });
  }
 
  // POST /api/v1/portal/alumno/actividades/{id}/entregar
  entregarTarea(actividadId: string, entrega: EntregaTarea): Observable<any> {
    const formData = new FormData();
    if (entrega.archivo) formData.append('archivo', entrega.archivo);
    if (entrega.comentario) formData.append('comentario', entrega.comentario);
    return this.http.post(
      `${this.api}/portal/alumno/actividades/${actividadId}/entregar`,
      formData,
      { headers: new HttpHeaders({ Authorization: `Bearer ${localStorage.getItem('token')}` }) }
    );
  }
    
}