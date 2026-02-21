import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ListaGenerosComponent } from './lista-generos.component';
import { GeneroService } from '../service/genero.service';
import { Generos } from '../generos';

describe('ListaGenerosComponent (Fase 5)', () => {
  let component: ListaGenerosComponent;
  let fixture: ComponentFixture<ListaGenerosComponent>;

  const mockGeneros: Generos[] = [
    { id: 1, name: 'Acción' },
    { id: 2, name: 'Drama' },
    { id: 3, name: 'Comedia' },
  ];

  beforeEach(async () => {
    const generoServiceSpy = jasmine.createSpyObj<GeneroService>('GeneroService', ['obtenerListaDeGeneros', 'eliminarGenero']);
    generoServiceSpy.obtenerListaDeGeneros.and.returnValue(of(mockGeneros));

    await TestBed.configureTestingModule({
      imports: [ListaGenerosComponent],
      providers: [
        provideRouter([]),
        { provide: GeneroService, useValue: generoServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaGenerosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('filteredGeneros', () => {
    beforeEach(() => {
      component.generos = [...mockGeneros];
    });

    it('sin searchInput devuelve todos los géneros', () => {
      component.searchInput = '';
      expect(component.filteredGeneros).toEqual(mockGeneros);
    });

    it('con searchInput que coincide por nombre filtra correctamente', () => {
      component.searchInput = 'ac';
      expect(component.filteredGeneros.length).toBe(1);
      expect(component.filteredGeneros[0].name).toBe('Acción');
    });

    it('con searchInput que no coincide devuelve array vacío', () => {
      component.searchInput = 'xyz';
      expect(component.filteredGeneros).toEqual([]);
    });

    it('filtro es case-insensitive', () => {
      component.searchInput = 'DRAMA';
      expect(component.filteredGeneros.length).toBe(1);
      expect(component.filteredGeneros[0].name).toBe('Drama');
    });
  });
});
