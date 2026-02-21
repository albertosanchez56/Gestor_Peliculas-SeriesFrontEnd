import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MovieService } from './movie.service';

describe('MovieService (Fase 2)', () => {
  let service: MovieService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:9090/peliculas';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MovieService],
    });
    service = TestBed.inject(MovieService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPeliculasBrowser', () => {
    it('debe hacer GET a /peliculas con page y size', () => {
      const mockMovies = [{ id: 1, title: 'Test' } as any];
      service.getPeliculasBrowser(0, 25).subscribe(data => {
        expect(data).toEqual(mockMovies);
      });

      const req = httpMock.expectOne(r => r.url === `${baseUrl}/peliculas` && r.method === 'GET');
      expect(req.request.params.get('page')).toBe('0');
      expect(req.request.params.get('size')).toBe('25');
      expect(req.request.params.has('q')).toBe(false);
      expect(req.request.params.has('genre')).toBe(false);
      req.flush(mockMovies);
    });

    it('debe incluir q en los params cuando se pasa búsqueda', () => {
      const mockMovies: any[] = [];
      service.getPeliculasBrowser(1, 50, 'matrix').subscribe(data => {
        expect(data).toEqual(mockMovies);
      });

      const req = httpMock.expectOne(r => r.url === `${baseUrl}/peliculas` && r.method === 'GET');
      expect(req.request.params.get('page')).toBe('1');
      expect(req.request.params.get('size')).toBe('50');
      expect(req.request.params.get('q')).toBe('matrix');
      req.flush(mockMovies);
    });

    it('debe incluir genre en los params cuando se pasa género', () => {
      const mockMovies: any[] = [];
      service.getPeliculasBrowser(0, 20, undefined, 'accion').subscribe(data => {
        expect(data).toEqual(mockMovies);
      });

      const req = httpMock.expectOne(r => r.url === `${baseUrl}/peliculas` && r.method === 'GET');
      expect(req.request.params.get('page')).toBe('0');
      expect(req.request.params.get('size')).toBe('20');
      expect(req.request.params.get('genre')).toBe('accion');
      req.flush(mockMovies);
    });

    it('debe incluir q y genre cuando se pasan ambos', () => {
      const mockMovies: any[] = [];
      service.getPeliculasBrowser(2, 30, 'dune', 'ciencia-ficcion').subscribe(data => {
        expect(data).toEqual(mockMovies);
      });

      const req = httpMock.expectOne(r => r.url === `${baseUrl}/peliculas` && r.method === 'GET');
      expect(req.request.params.get('page')).toBe('2');
      expect(req.request.params.get('size')).toBe('30');
      expect(req.request.params.get('q')).toBe('dune');
      expect(req.request.params.get('genre')).toBe('ciencia-ficcion');
      req.flush(mockMovies);
    });

    it('no debe incluir q ni genre cuando son vacíos o solo espacios', () => {
      service.getPeliculasBrowser(0, 10, '', undefined).subscribe();
      let req = httpMock.expectOne(r => r.url === `${baseUrl}/peliculas`);
      expect(req.request.params.has('q')).toBe(false);
      req.flush([]);

      service.getPeliculasBrowser(0, 10, '  ', '  ').subscribe();
      req = httpMock.expectOne(r => r.url === `${baseUrl}/peliculas`);
      expect(req.request.params.has('q')).toBe(false);
      expect(req.request.params.has('genre')).toBe(false);
      req.flush([]);
    });
  });
});
