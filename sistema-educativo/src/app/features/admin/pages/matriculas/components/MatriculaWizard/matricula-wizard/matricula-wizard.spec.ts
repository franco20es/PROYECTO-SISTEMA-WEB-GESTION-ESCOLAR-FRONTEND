import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatriculaWizard } from './matricula-wizard';

describe('MatriculaWizard', () => {
  let component: MatriculaWizard;
  let fixture: ComponentFixture<MatriculaWizard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatriculaWizard],
    }).compileComponents();

    fixture = TestBed.createComponent(MatriculaWizard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
