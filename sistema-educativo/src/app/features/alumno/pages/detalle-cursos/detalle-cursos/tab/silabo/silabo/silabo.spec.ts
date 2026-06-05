import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Silabo } from './silabo';

describe('Silabo', () => {
  let component: Silabo;
  let fixture: ComponentFixture<Silabo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Silabo],
    }).compileComponents();

    fixture = TestBed.createComponent(Silabo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
