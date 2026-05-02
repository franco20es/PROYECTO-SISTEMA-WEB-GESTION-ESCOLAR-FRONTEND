import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumnoForm } from './alumno-form';

describe('AlumnoForm', () => {
  let component: AlumnoForm;
  let fixture: ComponentFixture<AlumnoForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlumnoForm],
    }).compileComponents();

    fixture = TestBed.createComponent(AlumnoForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
