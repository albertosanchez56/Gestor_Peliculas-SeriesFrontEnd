import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarDirectorComponent } from './registrar-director.component';

describe('RegistrarDirectorComponent', () => {
  let component: RegistrarDirectorComponent;
  let fixture: ComponentFixture<RegistrarDirectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarDirectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarDirectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
