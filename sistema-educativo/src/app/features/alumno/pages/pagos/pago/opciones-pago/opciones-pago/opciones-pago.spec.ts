import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpcionesPago } from './opciones-pago';

describe('OpcionesPago', () => {
  let component: OpcionesPago;
  let fixture: ComponentFixture<OpcionesPago>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpcionesPago],
    }).compileComponents();

    fixture = TestBed.createComponent(OpcionesPago);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
