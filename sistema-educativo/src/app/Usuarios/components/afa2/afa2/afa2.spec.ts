import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Afa2 } from './afa2';

describe('Afa2', () => {
  let component: Afa2;
  let fixture: ComponentFixture<Afa2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Afa2],
    }).compileComponents();

    fixture = TestBed.createComponent(Afa2);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
