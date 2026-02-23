import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { MovieService } from './features/movies/service/movie.service';
import { AuthService } from './core/auth.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    const movieSvcMock = jasmine.createSpyObj('MovieService', ['searchSuggestions']);
    movieSvcMock.searchSuggestions.and.returnValue(of([]));
    const authMock = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'isAdmin', 'getCurrentUser', 'refreshSession']);
    authMock.isLoggedIn.and.returnValue(false);
    authMock.isAdmin.and.returnValue(false);
    authMock.getCurrentUser.and.returnValue(null);
    authMock.refreshSession.and.returnValue(of(null));
    (authMock as any).user$ = of(null);

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        { provide: MovieService, useValue: movieSvcMock },
        { provide: AuthService, useValue: authMock },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'Gestor_PeliculasYSerie_FrontEnd' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Gestor_PeliculasYSerie_FrontEnd');
  });

  it('should render the app with nav', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('nav')).toBeTruthy();
  });
});
