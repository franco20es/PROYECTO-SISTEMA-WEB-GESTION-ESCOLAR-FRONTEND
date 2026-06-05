// perfil-docente.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';  // ajusta la ruta

@Injectable({ providedIn: 'root' })
export class PerfilDocenteService {

  private http = inject(HttpClient);
  private api  = environment.apiUrl;

  // Mi perfil (docente autenticado)
  miPerfil(): Observable<any> {
    return this.http.get<any>(`${this.api}/docentes/mi-perfil`);
  }

  // Actualizar solo contacto (telefono, email, direccion)
  actualizarContacto(body: { telefono: string; email: string; direccion: string }): Observable<any> {
    return this.http.patch<any>(`${this.api}/docentes/mi-perfil/contacto`, body);
  }

  // Cambiar contraseña — usa /usuarios/{usuarioId}/cambiar-password con passwordNueva
  cambiarPassword(usuarioId: string, body: { passwordActual: string; passwordNueva: string }): Observable<void> {
    return this.http.patch<void>(`${this.api}/usuarios/${usuarioId}/cambiar-password`, body);
  }
}