import { inject, Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Alumno } from "../../../features/alumno/models/alumno.model";
import { environment } from "../../../../environment/environment";
import { Observable, tap } from "rxjs";
import {Router}from "@angular/router";
@Injectable({
    providedIn: 'root'
})
export class AutenticacionService {
 private http = inject(HttpClient);
  private router = inject(Router);
  private api = environment.apiUrl;

  login(email: string, password: string) {
    localStorage.clear(); // ← limpiar token viejo
    return this.http.post<any>(`${this.api}/auth/login`, { email, password })
      .pipe(
        tap(res => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('rol', res.rol);
          localStorage.setItem('nombre', res.nombre);
          localStorage.setItem('usuarioId', res.id);
          if (res.alumnoId)
            localStorage.setItem('alumnoId', res.alumnoId);
        })
      );
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRol(): string | null {
    return localStorage.getItem('rol');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  recuperarPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.api}/usuarios/recuperar-password`, { email });
  }

  // Redirige según rol del backend
  redirigirSegunRol(rol: string): void {
    const rutas: Record<string, string> = {
      ADMIN: '/admin/dashboard',
      DIRECTOR: '/admin/dashboard',
      SECRETARIA: '/admin/dashboard',
      DOCENTE: '/profesor/dashboard',
      ALUMNO: '/alumno/cursos'
    };
    this.router.navigate([rutas[rol] ?? '/login']);
  }
}