import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopbarWeb } from './topbar-web';

describe('TopbarWeb', () => {
  let component: TopbarWeb;
  let fixture: ComponentFixture<TopbarWeb>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopbarWeb],
    }).compileComponents();

    fixture = TestBed.createComponent(TopbarWeb);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
