import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('authGuard (Fase 1)', () => {
  let authServiceMock: jasmine.SpyObj<Pick<AuthService, 'isLoggedIn'>>;
  let routerMock: jasmine.SpyObj<Pick<Router, 'navigate'>>;

  const runGuard = (): boolean => {
    return TestBed.runInInjectionContext(() =>
      authGuard(null!, null!) as boolean
    );
  };

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });
  });

  it('debe permitir acceso cuando el usuario está logueado', () => {
    authServiceMock.isLoggedIn.and.returnValue(true);

    const result = runGuard();

    expect(result).toBe(true);
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('debe redirigir a /login y denegar acceso cuando el usuario no está logueado', () => {
    authServiceMock.isLoggedIn.and.returnValue(false);

    const result = runGuard();

    expect(result).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalledOnceWith(['/login']);
  });
});
