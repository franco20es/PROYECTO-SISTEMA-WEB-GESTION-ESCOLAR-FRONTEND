import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalizarMatricula } from './finalizar-matricula';

describe('FinalizarMatricula', () => {
  let component: FinalizarMatricula;
  let fixture: ComponentFixture<FinalizarMatricula>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinalizarMatricula],
    }).compileComponents();

    fixture = TestBed.createComponent(FinalizarMatricula);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
