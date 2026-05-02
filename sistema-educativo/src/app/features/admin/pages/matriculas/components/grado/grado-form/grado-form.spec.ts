import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradoForm } from './grado-form';

describe('GradoForm', () => {
  let component: GradoForm;
  let fixture: ComponentFixture<GradoForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradoForm],
    }).compileComponents();

    fixture = TestBed.createComponent(GradoForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
