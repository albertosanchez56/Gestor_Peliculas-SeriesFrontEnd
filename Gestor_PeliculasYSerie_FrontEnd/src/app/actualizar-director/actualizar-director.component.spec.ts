import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarDirectorComponent } from './actualizar-director.component';

describe('ActualizarDirectorComponent', () => {
  let component: ActualizarDirectorComponent;
  let fixture: ComponentFixture<ActualizarDirectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActualizarDirectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActualizarDirectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
