import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmacionMatricula } from './confirmacion-matricula';

describe('ConfirmacionMatricula', () => {
  let component: ConfirmacionMatricula;
  let fixture: ComponentFixture<ConfirmacionMatricula>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmacionMatricula],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmacionMatricula);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
