import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { RegistrarMoviesComponent } from './registrar-movies.component';
import { MovieService } from '../service/movie.service';
import { DirectorService } from '../../directores/service/director.service';
import { GeneroService } from '../../generos/service/genero.service';

describe('RegistrarMoviesComponent', () => {
  let component: RegistrarMoviesComponent;
  let fixture: ComponentFixture<RegistrarMoviesComponent>;

  beforeEach(async () => {
    const movieSvcMock = jasmine.createSpyObj('MovieService', ['registrarPelicula']);
    movieSvcMock.registrarPelicula.and.returnValue(of({} as any));
    const directorSvcMock = jasmine.createSpyObj('DirectorService', ['obtenerListaDeDirectores']);
    directorSvcMock.obtenerListaDeDirectores.and.returnValue(of([]));
    const generoSvcMock = jasmine.createSpyObj('GeneroService', ['obtenerListaDeGeneros']);
    generoSvcMock.obtenerListaDeGeneros.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [RegistrarMoviesComponent],
      providers: [
        provideRouter([]),
        { provide: MovieService, useValue: movieSvcMock },
        { provide: DirectorService, useValue: directorSvcMock },
        { provide: GeneroService, useValue: generoSvcMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrarMoviesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
