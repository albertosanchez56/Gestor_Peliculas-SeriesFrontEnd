import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ListaMoviesComponent } from './lista-movies.component';
import { MovieService } from '../service/movie.service';
import { GeneroService } from '../../generos/service/genero.service';
import { Movies } from '../movies';

describe('ListaMoviesComponent (Fase 4)', () => {
  let component: ListaMoviesComponent;
  let fixture: ComponentFixture<ListaMoviesComponent>;
  let movieServiceSpy: jasmine.SpyObj<Pick<MovieService, 'getPeliculasBrowser' | 'eliminarPelicula'>>;
  let generoServiceSpy: jasmine.SpyObj<Pick<GeneroService, 'getGenreCards'>>;
  let router: Router;
  let navigateSpy: jasmine.Spy;

  const mockMovies: Movies[] = [{ id: 1, title: 'Test', genres: [] } as Movies];
  /** 50 items para que la primera carga deje noMore=false y page=1 (para test loadMore) */
  const mockMovies50: Movies[] = Array.from({ length: 50 }, (_, i) =>
    ({ id: i + 1, title: `Movie ${i}`, genres: [] } as Movies)
  );

  beforeEach(async () => {
    movieServiceSpy = jasmine.createSpyObj('MovieService', ['getPeliculasBrowser', 'eliminarPelicula']);
    movieServiceSpy.getPeliculasBrowser.and.returnValue(of(mockMovies));
    movieServiceSpy.eliminarPelicula.and.returnValue(of({} as Object));

    generoServiceSpy = jasmine.createSpyObj('GeneroService', ['getGenreCards']);
    generoServiceSpy.getGenreCards.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [ListaMoviesComponent],
      providers: [
        provideRouter([]),
        { provide: MovieService, useValue: movieServiceSpy },
        { provide: GeneroService, useValue: generoServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaMoviesComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    navigateSpy = spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('en ngOnInit debe cargar géneros y la primera página', () => {
    expect(generoServiceSpy.getGenreCards).toHaveBeenCalled();
    expect(movieServiceSpy.getPeliculasBrowser).toHaveBeenCalledWith(0, 50, undefined, undefined);
    expect(component.movies).toEqual(mockMovies);
  });

  it('onGenreChange debe recargar con genre y página 0', () => {
    movieServiceSpy.getPeliculasBrowser.calls.reset();
    component.currentGenre = 'accion';
    component.onGenreChange('accion');

    expect(movieServiceSpy.getPeliculasBrowser).toHaveBeenCalledWith(0, 50, undefined, 'accion');
    expect(component.movies).toEqual(mockMovies);
  });

  it('loadMore debe llamar getPeliculasBrowser con la página siguiente', () => {
    movieServiceSpy.getPeliculasBrowser.calls.reset();
    movieServiceSpy.getPeliculasBrowser.and.returnValue(of(mockMovies50));

    fixture = TestBed.createComponent(ListaMoviesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(movieServiceSpy.getPeliculasBrowser).toHaveBeenCalledWith(0, 50, undefined, undefined);
    movieServiceSpy.getPeliculasBrowser.calls.reset();

    component.loadMore();

    expect(movieServiceSpy.getPeliculasBrowser).toHaveBeenCalledWith(1, 50, undefined, undefined);
  });

  it('onSearchInputChange con debounce debe recargar con q tras 350ms', fakeAsync(() => {
    movieServiceSpy.getPeliculasBrowser.calls.reset();
    component.searchInput = 'matrix';
    component.onSearchInputChange();

    expect(movieServiceSpy.getPeliculasBrowser).not.toHaveBeenCalled();

    tick(350);

    expect(movieServiceSpy.getPeliculasBrowser).toHaveBeenCalledWith(0, 50, 'matrix', undefined);
  }));

  it('agregarPelicula debe navegar a registrar-pelicula', () => {
    component.agregarPelicula();
    expect(navigateSpy).toHaveBeenCalledWith(['registrar-pelicula']);
  });

  it('actualizarPelicula debe navegar a actualizar-pelicula con id', () => {
    component.actualizarPelicula(42);
    expect(navigateSpy).toHaveBeenCalledWith(['actualizar-pelicula', 42]);
  });
});
