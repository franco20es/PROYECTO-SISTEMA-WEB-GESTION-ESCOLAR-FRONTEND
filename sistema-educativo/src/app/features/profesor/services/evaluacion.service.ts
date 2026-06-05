// evaluacion-docente.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class EvaluacionDocenteService {

  private http = inject(HttpClient);
  private api  = environment.apiUrl;

  // ── Periodos ──
  getPeriodos(anio: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/periodos/anio/${anio}/ordenado`);
  }

  // ── Componentes ──
  listarComponentes(cursoId: string, periodoId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/componentes-nota/curso/${cursoId}/periodo/${periodoId}`);
  }

  sumaPesos(cursoId: string, periodoId: string): Observable<number> {
    return this.http.get<number>(`${this.api}/componentes-nota/curso/${cursoId}/periodo/${periodoId}/suma-pesos`);
  }

  crearComponente(body: any): Observable<any> {
    return this.http.post<any>(`${this.api}/componentes-nota`, body);
  }

  eliminarComponente(componenteId: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/componentes-nota/${componenteId}`);
  }

  // ── Alumnos y notas ──
  alumnosSeccion(seccionId: string): Observable<any> {
    const params = new HttpParams().set('size', 100);
    return this.http.get<any>(`${this.api}/matriculas/seccion/${seccionId}`, { params });
  }

  notasComponente(componenteId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/componentes-nota/notas/componente/${componenteId}`);
  }

  registrarNota(body: any): Observable<any> {
    return this.http.post<any>(`${this.api}/componentes-nota/notas`, body);
  }

  actualizarNota(notaId: string, body: any): Observable<any> {
    return this.http.put<any>(`${this.api}/componentes-nota/notas/${notaId}`, body);
  }

  // ── Examenes en linea ──
  listarExamenes(cursoId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/examenes/curso/${cursoId}`);
  }

  crearExamen(body: any): Observable<any> {
    return this.http.post<any>(`${this.api}/examenes`, body);
  }

  publicarExamen(examenId: string): Observable<void> {
    return this.http.patch<void>(`${this.api}/examenes/${examenId}/publicar`, {});
  }

  eliminarExamen(examenId: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/examenes/${examenId}`);
  }
}