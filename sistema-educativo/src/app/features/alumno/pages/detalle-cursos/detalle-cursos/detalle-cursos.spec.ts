import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleCursos } from './detalle-cursos';

describe('DetalleCursos', () => {
  let component: DetalleCursos;
  let fixture: ComponentFixture<DetalleCursos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleCursos],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleCursos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
