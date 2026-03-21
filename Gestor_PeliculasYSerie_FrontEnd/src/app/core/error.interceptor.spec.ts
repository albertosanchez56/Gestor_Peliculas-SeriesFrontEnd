import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { errorInterceptor } from './error.interceptor';
import { AuthService } from './auth.service';

describe('errorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let authMock: jasmine.SpyObj<Pick<AuthService, 'logout'>>;
  let routerMock: jasmine.SpyObj<Pick<Router, 'navigate'>>;

  describe('en el navegador', () => {
    beforeEach(() => {
      authMock = jasmine.createSpyObj('AuthService', ['logout']);
      routerMock = jasmine.createSpyObj('Router', ['navigate']);
      spyOn(Swal, 'fire').and.returnValue(Promise.resolve({} as any));

      TestBed.configureTestingModule({
        providers: [
          provideHttpClient(withInterceptors([errorInterceptor])),
          provideHttpClientTesting(),
          { provide: AuthService, useValue: authMock },
          { provide: Router, useValue: routerMock },
          { provide: PLATFORM_ID, useValue: 'browser' },
        ],
      });

      http = TestBed.inject(HttpClient);
      httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
      httpMock.verify();
    });

    it('401: llama logout, navega a /login y muestra aviso de sesión', () => {
      http.get('/api/test').subscribe({ error: () => {} });

      const req = httpMock.expectOne('/api/test');
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

      expect(authMock.logout).toHaveBeenCalled();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
          icon: 'warning',
          title: 'Sesión expirada',
        })
      );
    });

    it('403: muestra aviso de sin permiso sin logout', () => {
      http.get('/api/test').subscribe({ error: () => {} });

      const req = httpMock.expectOne('/api/test');
      req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });

      expect(authMock.logout).not.toHaveBeenCalled();
      expect(routerMock.navigate).not.toHaveBeenCalled();
      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
          icon: 'error',
          title: 'Sin permiso',
        })
      );
    });

    it('500: muestra aviso de error del servidor', () => {
      http.get('/api/test').subscribe({ error: () => {} });

      const req = httpMock.expectOne('/api/test');
      req.flush('Error', { status: 500, statusText: 'Server Error' });

      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
          icon: 'error',
          title: 'Error del servidor',
        })
      );
    });

    it('status 0 (red): muestra aviso de error del servidor', () => {
      http.get('/api/test').subscribe({ error: () => {} });

      const req = httpMock.expectOne('/api/test');
      req.error(new ProgressEvent('error'), { status: 0, statusText: 'Unknown' });

      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
          title: 'Error del servidor',
        })
      );
    });

    it('404: no muestra SweetAlert global (lo maneja el componente)', () => {
      http.get('/api/test').subscribe({ error: () => {} });

      const req = httpMock.expectOne('/api/test');
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });

      expect(Swal.fire).not.toHaveBeenCalled();
    });
  });

  describe('fuera del navegador (SSR)', () => {
    beforeEach(() => {
      authMock = jasmine.createSpyObj('AuthService', ['logout']);
      routerMock = jasmine.createSpyObj('Router', ['navigate']);
      spyOn(Swal, 'fire').and.returnValue(Promise.resolve({} as any));

      TestBed.configureTestingModule({
        providers: [
          provideHttpClient(withInterceptors([errorInterceptor])),
          provideHttpClientTesting(),
          { provide: AuthService, useValue: authMock },
          { provide: Router, useValue: routerMock },
          { provide: PLATFORM_ID, useValue: 'server' },
        ],
      });

      http = TestBed.inject(HttpClient);
      httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
      httpMock.verify();
    });

    it('401: no ejecuta logout ni navegación ni Swal', () => {
      http.get('/api/test').subscribe({ error: () => {} });

      const req = httpMock.expectOne('/api/test');
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

      expect(authMock.logout).not.toHaveBeenCalled();
      expect(routerMock.navigate).not.toHaveBeenCalled();
      expect(Swal.fire).not.toHaveBeenCalled();
    });
  });
});
