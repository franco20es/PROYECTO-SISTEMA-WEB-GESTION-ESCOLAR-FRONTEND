// docente.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class DocenteService {

    private http = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/docentes`;

   listarConFiltros(estadoContrato?: string, term?: string, pagina = 0, tamano = 10): Observable<any> {
  let params = new HttpParams()
    .set('page', pagina)
    .set('size', tamano);
  if (estadoContrato) params = params.set('estadoContrato', estadoContrato);
  if (term && term.trim()) params = params.set('term', term);
  
  console.log('Params:', params.toString()); // ← log
  return this.http.get<any>(`${this.baseUrl}/filtros`, { params });
}

    buscarPorId(id: string): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/${id}`);
    }

    actualizar(id: string, docente: any): Observable<any> {
        return this.http.put<any>(`${this.baseUrl}/${id}`, docente);
    }

    activar(id: string): Observable<any> {
        return this.http.patch<any>(`${this.baseUrl}/${id}/activar`, {});
    }

    desactivar(id: string): Observable<any> {
        return this.http.patch<any>(`${this.baseUrl}/${id}/desactivar`, {});
    }

    ponerEnLicencia(id: string): Observable<any> {
        return this.http.patch<any>(`${this.baseUrl}/${id}/licencia`, {});
    }

    // docente.service.ts
    crear(docente: any): Observable<any> {
        return this.http.post<any>(this.baseUrl, docente);
    }

    exportarExcel(): Observable<Blob> {
        return this.http.get(`${environment.apiUrl}/reportes/docentes`, { responseType: 'blob' });
    }
}