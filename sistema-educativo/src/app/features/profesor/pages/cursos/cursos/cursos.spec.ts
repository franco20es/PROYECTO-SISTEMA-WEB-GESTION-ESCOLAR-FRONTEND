import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursosProfesor } from './cursos';

describe('CursosProfesor', () => {
  let component: CursosProfesor;
  let fixture: ComponentFixture<CursosProfesor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CursosProfesor],
    }).compileComponents();

    fixture = TestBed.createComponent(CursosProfesor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
