
// configuracion de interceptor para agregar token a las peticiones http 

// interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // ← excluir rutas públicas
  if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
    return next(req);
  }

  const token = localStorage.getItem('token');

  if (token) {
    return next(req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    }));
  }
  return next(req);
};