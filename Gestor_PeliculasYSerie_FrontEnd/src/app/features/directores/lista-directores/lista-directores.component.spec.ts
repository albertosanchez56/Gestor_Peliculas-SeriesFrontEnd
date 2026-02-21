import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ListaDirectoresComponent } from './lista-directores.component';
import { DirectorService } from '../service/director.service';
import { Director } from '../director';

describe('ListaDirectoresComponent (Fase 5)', () => {
  let component: ListaDirectoresComponent;
  let fixture: ComponentFixture<ListaDirectoresComponent>;

  const mockDirectores: Director[] = [
    { id: 1, name: 'Nolan' },
    { id: 2, name: 'Spielberg' },
    { id: 3, name: 'Tarantino' },
  ];

  beforeEach(async () => {
    const directorServiceSpy = jasmine.createSpyObj<DirectorService>('DirectorService', ['obtenerListaDeDirectores', 'eliminarDirector']);
    directorServiceSpy.obtenerListaDeDirectores.and.returnValue(of(mockDirectores));

    await TestBed.configureTestingModule({
      imports: [ListaDirectoresComponent],
      providers: [
        provideRouter([]),
        { provide: DirectorService, useValue: directorServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaDirectoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('filteredDirectores', () => {
    beforeEach(() => {
      component.directores = [...mockDirectores];
    });

    it('sin searchInput devuelve todos los directores', () => {
      component.searchInput = '';
      expect(component.filteredDirectores).toEqual(mockDirectores);
    });

    it('con searchInput que coincide por nombre filtra correctamente', () => {
      component.searchInput = 'spiel';
      expect(component.filteredDirectores.length).toBe(1);
      expect(component.filteredDirectores[0].name).toBe('Spielberg');
    });

    it('con searchInput que no coincide devuelve array vacío', () => {
      component.searchInput = 'xyz';
      expect(component.filteredDirectores).toEqual([]);
    });

    it('filtro es case-insensitive', () => {
      component.searchInput = 'TARANTINO';
      expect(component.filteredDirectores.length).toBe(1);
      expect(component.filteredDirectores[0].name).toBe('Tarantino');
    });
  });
});
