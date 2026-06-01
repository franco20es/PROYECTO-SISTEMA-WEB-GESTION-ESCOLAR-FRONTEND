import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';
 
@Injectable({ providedIn: 'root' })
export class RecuperarPasswordService {
 
  private http = inject(HttpClient);
  private api = environment.apiUrl;
 
  // Paso 1 — solicitar recuperación (envía email con link)
  solicitarRecuperacion(email: string): Observable<any> {
    return this.http.post<any>(`${this.api}/auth/recuperar-password`, { email });
  }
 
  // Paso 2 — restablecer contraseña con token
  restablecerPassword(token: string, passwordNuevo: string): Observable<any> {
    return this.http.post<any>(`${this.api}/auth/restablecer-password`, {
      token,
      passwordNuevo
    });
  }
}