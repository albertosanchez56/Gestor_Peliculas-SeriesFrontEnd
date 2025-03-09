import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaMoviesComponent } from './lista-movies.component';

describe('ListaMoviesComponent', () => {
  let component: ListaMoviesComponent;
  let fixture: ComponentFixture<ListaMoviesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaMoviesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaMoviesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
