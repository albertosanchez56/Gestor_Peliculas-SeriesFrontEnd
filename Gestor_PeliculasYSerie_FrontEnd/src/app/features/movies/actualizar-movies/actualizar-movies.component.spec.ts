import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarMoviesComponent } from './actualizar-movies.component';

describe('ActualizarMoviesComponent', () => {
  let component: ActualizarMoviesComponent;
  let fixture: ComponentFixture<ActualizarMoviesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActualizarMoviesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActualizarMoviesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
