import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Perfilp } from './perfilp';

describe('Perfilp', () => {
  let component: Perfilp;
  let fixture: ComponentFixture<Perfilp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Perfilp],
    }).compileComponents();

    fixture = TestBed.createComponent(Perfilp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
