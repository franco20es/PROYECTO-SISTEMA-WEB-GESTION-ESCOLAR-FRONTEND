import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosAlumno } from './datos-alumno';

describe('DatosAlumno', () => {
  let component: DatosAlumno;
  let fixture: ComponentFixture<DatosAlumno>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosAlumno],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosAlumno);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
