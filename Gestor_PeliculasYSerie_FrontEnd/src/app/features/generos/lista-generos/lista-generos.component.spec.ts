import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaGenerosComponent } from './lista-generos.component';

describe('ListaGenerosComponent', () => {
  let component: ListaGenerosComponent;
  let fixture: ComponentFixture<ListaGenerosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaGenerosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaGenerosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
