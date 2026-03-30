import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplySavings } from './apply-savings';

describe('ApplySavings', () => {
  let component: ApplySavings;
  let fixture: ComponentFixture<ApplySavings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplySavings],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplySavings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
