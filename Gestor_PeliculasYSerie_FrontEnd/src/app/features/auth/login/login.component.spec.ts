import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/auth.service';
import { CurrentUser } from '../../../core/auth.models';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let authMock: jasmine.SpyObj<Pick<AuthService, 'login'>>;
  let navigateSpy: jasmine.Spy;

  const usuarioOk: CurrentUser = {
    id: 1,
    username: 'testuser',
    displayName: 'Test',
    role: 'USER',
  };

  beforeEach(async () => {
    authMock = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    navigateSpy = spyOn(TestBed.inject(Router), 'navigate');
  });

  it('debe crearse', () => {
    expect(component).toBeTruthy();
  });

  it('no debe llamar a login si el formulario es inválido', () => {
    component.form.patchValue({ usernameOrEmail: '', password: '' });
    component.submit();
    expect(authMock.login).not.toHaveBeenCalled();
  });

  it('debe llamar a login con login y password y navegar a Home al éxito', () => {
    authMock.login.and.returnValue(of(usuarioOk));
    component.form.patchValue({ usernameOrEmail: 'user@mail.com', password: 'secret' });

    component.submit();

    expect(authMock.login).toHaveBeenCalledWith({
      login: 'user@mail.com',
      password: 'secret',
    });
    expect(navigateSpy).toHaveBeenCalledWith(['/Home']);
    expect(component.loading).toBe(false);
    expect(component.error).toBe('');
  });

  it('debe mostrar el mensaje del backend si el login falla con mensaje', () => {
    authMock.login.and.returnValue(
      throwError(() => ({ error: { message: 'Credenciales incorrectas' } }))
    );
    component.form.patchValue({ usernameOrEmail: 'x', password: 'y' });

    component.submit();

    expect(component.error).toBe('Credenciales incorrectas');
    expect(component.loading).toBe(false);
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('debe mostrar mensaje por defecto si el error no trae message', () => {
    authMock.login.and.returnValue(throwError(() => ({})));
    component.form.patchValue({ usernameOrEmail: 'x', password: 'y' });

    component.submit();

    expect(component.error).toBe('Login incorrecto.');
  });

  it('no debe enviar de nuevo si loading es true', () => {
    authMock.login.and.returnValue(of(usuarioOk));
    component.form.patchValue({ usernameOrEmail: 'a', password: 'b' });
    component.loading = true;

    component.submit();

    expect(authMock.login).not.toHaveBeenCalled();
  });
});
