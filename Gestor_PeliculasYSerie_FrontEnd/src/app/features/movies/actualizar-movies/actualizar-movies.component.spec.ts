import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ActualizarMoviesComponent } from './actualizar-movies.component';
import { MovieService } from '../service/movie.service';
import { DirectorService } from '../../directores/service/director.service';
import { GeneroService } from '../../generos/service/genero.service';

describe('ActualizarMoviesComponent', () => {
  let component: ActualizarMoviesComponent;
  let fixture: ComponentFixture<ActualizarMoviesComponent>;

  beforeEach(async () => {
    const routeMock = {
      snapshot: { params: { id: '1' }, paramMap: { get: (k: string) => (k === 'id' ? '1' : null) } },
      paramMap: of(new Map([['id', '1']])),
    };
    const movieSvcMock = jasmine.createSpyObj('MovieService', ['obtenerPeliculaPorId', 'actualizarPelicula']);
    movieSvcMock.obtenerPeliculaPorId.and.returnValue(of({ id: 1, title: 'Test', genres: [] } as any));
    movieSvcMock.actualizarPelicula.and.returnValue(of({}));
    const directorSvcMock = jasmine.createSpyObj('DirectorService', ['obtenerListaDeDirectores']);
    directorSvcMock.obtenerListaDeDirectores.and.returnValue(of([]));
    const generoSvcMock = jasmine.createSpyObj('GeneroService', ['obtenerListaDeGeneros']);
    generoSvcMock.obtenerListaDeGeneros.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [ActualizarMoviesComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: routeMock },
        { provide: MovieService, useValue: movieSvcMock },
        { provide: DirectorService, useValue: directorSvcMock },
        { provide: GeneroService, useValue: generoSvcMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ActualizarMoviesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
