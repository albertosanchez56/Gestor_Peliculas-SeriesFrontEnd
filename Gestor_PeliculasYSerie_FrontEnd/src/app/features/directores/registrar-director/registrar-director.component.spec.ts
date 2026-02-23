import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { RegistrarDirectorComponent } from './registrar-director.component';
import { DirectorService } from '../service/director.service';

describe('RegistrarDirectorComponent', () => {
  let component: RegistrarDirectorComponent;
  let fixture: ComponentFixture<RegistrarDirectorComponent>;

  beforeEach(async () => {
    const directorSvcMock = jasmine.createSpyObj('DirectorService', ['obtenerListaDeDirectores', 'registrarDirector']);
    directorSvcMock.obtenerListaDeDirectores.and.returnValue(of([]));
    directorSvcMock.registrarDirector.and.returnValue(of({} as any));

    await TestBed.configureTestingModule({
      imports: [RegistrarDirectorComponent],
      providers: [
        provideRouter([]),
        { provide: DirectorService, useValue: directorSvcMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrarDirectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
