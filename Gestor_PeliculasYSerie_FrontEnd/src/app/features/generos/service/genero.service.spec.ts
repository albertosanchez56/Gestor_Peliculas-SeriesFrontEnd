import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GeneroService } from './genero.service';

describe('GeneroService', () => {
  let service: GeneroService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GeneroService],
    });
    service = TestBed.inject(GeneroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
