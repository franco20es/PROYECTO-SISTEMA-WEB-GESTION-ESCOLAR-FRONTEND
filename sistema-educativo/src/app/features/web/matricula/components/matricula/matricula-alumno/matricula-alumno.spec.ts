import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatriculaAlumno } from './matricula-alumno';

describe('MatriculaAlumno', () => {
  let component: MatriculaAlumno;
  let fixture: ComponentFixture<MatriculaAlumno>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatriculaAlumno],
    }).compileComponents();

    fixture = TestBed.createComponent(MatriculaAlumno);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
