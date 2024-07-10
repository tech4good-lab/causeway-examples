import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyGoalItemComponent } from './weekly-goal-item.component';

describe('WeeklyGoalItemComponent', () => {
  let component: WeeklyGoalItemComponent;
  let fixture: ComponentFixture<WeeklyGoalItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklyGoalItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeeklyGoalItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
