import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ActualizarDirectorComponent } from './actualizar-director.component';
import { DirectorService } from '../service/director.service';

describe('ActualizarDirectorComponent', () => {
  let component: ActualizarDirectorComponent;
  let fixture: ComponentFixture<ActualizarDirectorComponent>;

  beforeEach(async () => {
    const routeMock = { snapshot: { params: { id: '1' } } };
    const directorSvcMock = jasmine.createSpyObj('DirectorService', ['obtenerDirectorPorId', 'actualizarDirector']);
    directorSvcMock.obtenerDirectorPorId.and.returnValue(of({ id: 1, name: 'Test' }));
    directorSvcMock.actualizarDirector.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [ActualizarDirectorComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: routeMock },
        { provide: DirectorService, useValue: directorSvcMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ActualizarDirectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
