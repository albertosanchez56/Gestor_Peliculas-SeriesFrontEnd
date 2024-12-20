import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarGenerosComponent } from './actualizar-generos.component';

describe('ActualizarGenerosComponent', () => {
  let component: ActualizarGenerosComponent;
  let fixture: ComponentFixture<ActualizarGenerosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActualizarGenerosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActualizarGenerosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
