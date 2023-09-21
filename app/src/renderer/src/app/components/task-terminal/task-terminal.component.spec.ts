import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskTerminalComponent } from './task-terminal.component';

describe('TaskTerminalComponent', () => {
  let component: TaskTerminalComponent;
  let fixture: ComponentFixture<TaskTerminalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskTerminalComponent]
    });
    fixture = TestBed.createComponent(TaskTerminalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
