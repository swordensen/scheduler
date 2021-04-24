import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedTaskFormComponent } from './advanced-task-form.component';

describe('AdvancedTaskFormComponent', () => {
  let component: AdvancedTaskFormComponent;
  let fixture: ComponentFixture<AdvancedTaskFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedTaskFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedTaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
