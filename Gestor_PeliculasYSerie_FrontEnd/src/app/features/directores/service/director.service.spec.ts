import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DirectorService } from './director.service';

describe('DirectorService', () => {
  let service: DirectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DirectorService],
    });
    service = TestBed.inject(DirectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
