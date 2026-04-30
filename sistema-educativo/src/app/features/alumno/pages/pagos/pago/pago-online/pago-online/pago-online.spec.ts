import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoOnline } from './pago-online';

describe('PagoOnline', () => {
  let component: PagoOnline;
  let fixture: ComponentFixture<PagoOnline>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagoOnline],
    }).compileComponents();

    fixture = TestBed.createComponent(PagoOnline);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
