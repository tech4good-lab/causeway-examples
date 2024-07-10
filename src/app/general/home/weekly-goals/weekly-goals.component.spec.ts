import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyGoalsComponent } from './weekly-goals.component';

describe('WeeklyGoalsComponent', () => {
  let component: WeeklyGoalsComponent;
  let fixture: ComponentFixture<WeeklyGoalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklyGoalsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeeklyGoalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
