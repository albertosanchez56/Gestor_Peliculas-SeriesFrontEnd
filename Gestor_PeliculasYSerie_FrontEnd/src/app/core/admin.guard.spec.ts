import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { adminGuard } from './admin.guard';
import { AuthService } from './auth.service';

describe('adminGuard (Fase 1)', () => {
  let authServiceMock: jasmine.SpyObj<Pick<AuthService, 'isLoggedIn' | 'isAdmin'>>;
  let routerMock: jasmine.SpyObj<Pick<Router, 'navigate'>>;

  const runGuard = (): boolean => {
    return TestBed.runInInjectionContext(() =>
      adminGuard(null!, null!) as boolean
    );
  };

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'isAdmin']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });
  });

  it('debe permitir acceso cuando el usuario está logueado y es admin', () => {
    authServiceMock.isLoggedIn.and.returnValue(true);
    authServiceMock.isAdmin.and.returnValue(true);

    const result = runGuard();

    expect(result).toBe(true);
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('debe redirigir a /login y denegar acceso cuando el usuario no está logueado', () => {
    authServiceMock.isLoggedIn.and.returnValue(false);
    authServiceMock.isAdmin.and.returnValue(false);

    const result = runGuard();

    expect(result).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalledOnceWith(['/login']);
    expect(authServiceMock.isAdmin).not.toHaveBeenCalled();
  });

  it('debe redirigir a /Home y denegar acceso cuando está logueado pero no es admin', () => {
    authServiceMock.isLoggedIn.and.returnValue(true);
    authServiceMock.isAdmin.and.returnValue(false);

    const result = runGuard();

    expect(result).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalledOnceWith(['/Home']);
  });
});
