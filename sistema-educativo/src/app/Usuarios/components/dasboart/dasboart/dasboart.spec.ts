import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dasboart } from './dasboart';

describe('Dasboart', () => {
  let component: Dasboart;
  let fixture: ComponentFixture<Dasboart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dasboart],
    }).compileComponents();

    fixture = TestBed.createComponent(Dasboart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
