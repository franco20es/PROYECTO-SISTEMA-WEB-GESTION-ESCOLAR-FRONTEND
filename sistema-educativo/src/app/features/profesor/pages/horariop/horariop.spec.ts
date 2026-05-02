import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Horariop } from './horariop';

describe('Horariop', () => {
  let component: Horariop;
  let fixture: ComponentFixture<Horariop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Horariop],
    }).compileComponents();

    fixture = TestBed.createComponent(Horariop);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
