import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarGenerosComponent } from './registrar-generos.component';

describe('RegistrarGenerosComponent', () => {
  let component: RegistrarGenerosComponent;
  let fixture: ComponentFixture<RegistrarGenerosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarGenerosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarGenerosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
