import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAsistencia } from './modal-asistencia';

describe('ModalAsistencia', () => {
  let component: ModalAsistencia;
  let fixture: ComponentFixture<ModalAsistencia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAsistencia],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalAsistencia);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
