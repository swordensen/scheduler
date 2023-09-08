import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskGroupComponent } from './task-group.component';

describe('TaskGroupComponent', () => {
  let component: TaskGroupComponent;
  let fixture: ComponentFixture<TaskGroupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskGroupComponent]
    });
    fixture = TestBed.createComponent(TaskGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
