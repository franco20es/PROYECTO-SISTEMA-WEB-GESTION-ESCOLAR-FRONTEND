import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatriculaOnline } from './matricula-online';

describe('MatriculaOnline', () => {
  let component: MatriculaOnline;
  let fixture: ComponentFixture<MatriculaOnline>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatriculaOnline],
    }).compileComponents();

    fixture = TestBed.createComponent(MatriculaOnline);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
