import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);
  const auth = inject(AuthService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (!isPlatformBrowser(platformId)) {
        return throwError(() => err);
      }

      const status = err.status;

      if (status === 401) {
        auth.logout();
        router.navigate(['/login']);
        Swal.fire({
          icon: 'warning',
          title: 'Sesión expirada',
          text: 'Tu sesión ha caducado o no es válida. Inicia sesión de nuevo.',
        });
        return throwError(() => err);
      }

      if (status === 403) {
        Swal.fire({
          icon: 'error',
          title: 'Sin permiso',
          text: 'No tienes permiso para realizar esta acción.',
        });
        return throwError(() => err);
      }

      if (status >= 500 || status === 0) {
        Swal.fire({
          icon: 'error',
          title: 'Error del servidor',
          text: err.message || 'Ha ocurrido un error. Inténtalo más tarde.',
        });
        return throwError(() => err);
      }

      // 400, 404, etc.: no mostrar Swal global para no duplicar mensajes que ya maneje el componente
      return throwError(() => err);
    })
  );
};
