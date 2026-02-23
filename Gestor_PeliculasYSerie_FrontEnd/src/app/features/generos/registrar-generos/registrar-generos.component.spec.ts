import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { RegistrarGenerosComponent } from './registrar-generos.component';
import { GeneroService } from '../service/genero.service';

describe('RegistrarGenerosComponent', () => {
  let component: RegistrarGenerosComponent;
  let fixture: ComponentFixture<RegistrarGenerosComponent>;

  beforeEach(async () => {
    const generoSvcMock = jasmine.createSpyObj('GeneroService', ['registrarGenero']);
    generoSvcMock.registrarGenero.and.returnValue(of({} as any));

    await TestBed.configureTestingModule({
      imports: [RegistrarGenerosComponent],
      providers: [
        provideRouter([]),
        { provide: GeneroService, useValue: generoSvcMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrarGenerosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
