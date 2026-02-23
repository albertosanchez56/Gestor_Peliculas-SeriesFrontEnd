import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { IndexComponent } from './index.component';
import { MovieService } from '../movies/service/movie.service';
import { GeneroService } from '../generos/service/genero.service';

describe('IndexComponent', () => {
  let component: IndexComponent;
  let fixture: ComponentFixture<IndexComponent>;

  beforeEach(async () => {
    const movieSvcMock = jasmine.createSpyObj('MovieService', ['getTopRated', 'getTopRatedByGenre', 'getPopularActors', 'getUpcoming', 'getAll']);
    movieSvcMock.getTopRated.and.returnValue(of([]));
    movieSvcMock.getTopRatedByGenre.and.returnValue(of([]));
    movieSvcMock.getPopularActors.and.returnValue(of([]));
    movieSvcMock.getUpcoming.and.returnValue(of([]));
    movieSvcMock.getAll.and.returnValue(of([]));
    const generoSvcMock = jasmine.createSpyObj('GeneroService', ['getGenreCards']);
    generoSvcMock.getGenreCards.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [IndexComponent],
      providers: [
        provideRouter([]),
        { provide: MovieService, useValue: movieSvcMock },
        { provide: GeneroService, useValue: generoSvcMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
