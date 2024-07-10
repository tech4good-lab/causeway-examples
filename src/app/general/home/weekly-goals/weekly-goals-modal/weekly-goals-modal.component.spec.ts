import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyGoalsModalComponent } from './weekly-goals-modal.component';

describe('WeeklyGoalsModalComponent', () => {
  let component: WeeklyGoalsModalComponent;
  let fixture: ComponentFixture<WeeklyGoalsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklyGoalsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeeklyGoalsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
