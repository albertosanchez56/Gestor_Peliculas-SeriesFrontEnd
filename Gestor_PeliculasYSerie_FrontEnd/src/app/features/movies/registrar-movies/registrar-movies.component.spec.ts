import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarMoviesComponent } from './registrar-movies.component';

describe('RegistrarMoviesComponent', () => {
  let component: RegistrarMoviesComponent;
  let fixture: ComponentFixture<RegistrarMoviesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarMoviesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarMoviesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
