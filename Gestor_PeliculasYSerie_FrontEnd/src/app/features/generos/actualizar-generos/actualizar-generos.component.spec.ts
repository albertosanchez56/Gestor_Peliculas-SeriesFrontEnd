import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ActualizarGenerosComponent } from './actualizar-generos.component';
import { GeneroService } from '../service/genero.service';

describe('ActualizarGenerosComponent', () => {
  let component: ActualizarGenerosComponent;
  let fixture: ComponentFixture<ActualizarGenerosComponent>;

  beforeEach(async () => {
    const routeMock = { snapshot: { params: { id: '1' } } };
    const generoSvcMock = jasmine.createSpyObj('GeneroService', ['obtenerGeneroPorId', 'actualizarGenero']);
    generoSvcMock.obtenerGeneroPorId.and.returnValue(of({ id: 1, name: 'Test' } as any));
    generoSvcMock.actualizarGenero.and.returnValue(of({} as any));

    await TestBed.configureTestingModule({
      imports: [ActualizarGenerosComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: routeMock },
        { provide: GeneroService, useValue: generoSvcMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ActualizarGenerosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
