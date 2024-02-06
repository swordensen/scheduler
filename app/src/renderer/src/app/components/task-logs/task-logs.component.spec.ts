import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskLogsComponent } from './task-logs.component';

describe('TaskLogsComponent', () => {
  let component: TaskLogsComponent;
  let fixture: ComponentFixture<TaskLogsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskLogsComponent]
    });
    fixture = TestBed.createComponent(TaskLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
