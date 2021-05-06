import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { remote } from 'electron';
import { take } from 'rxjs/operators';
import {
  addPathToTaskFormCommand,
  addTask,
  updateTaskForm,
} from 'src/app/@core/store/actions/schedule.actions';
import { selectTaskForm } from 'src/app/@core/store/selectors/taskForm.schedule';
import { Task } from '../../../../../main/types';

@Component({
  selector: 'app-advanced-task-form',
  templateUrl: './advanced-task-form.component.html',
  styleUrls: ['./advanced-task-form.component.scss'],
})
export class AdvancedTaskFormComponent implements OnInit {
  taskForm: FormGroup;

  get arguments() {
    return this.taskForm.get('arguments') as FormArray;
  }

  constructor(
    private store: Store<{ taskForm: Partial<Task> }>,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.store
      .select(selectTaskForm)
      .pipe(take(1))
      .subscribe((task) => {
        this.taskForm = this.fb.group({
          ...task,
          arguments: task.arguments
            ? this.fb.array(task.arguments?.map((arg) => this.fb.control(arg)))
            : [],
        });

        this.taskForm.valueChanges.subscribe((taskForm) => {
          this.store.dispatch(updateTaskForm({ taskForm }));
        });
      });
  }

  async browse() {
    const dialogResponse = await remote.dialog.showOpenDialog({
      properties: ['openFile', 'showHiddenFiles'],
    });
    const path = dialogResponse.filePaths[0];
    const commandControl = this.taskForm.get('command');
    const commandControlValue = commandControl?.value;
    commandControl?.setValue(commandControlValue + path);
    // this.store.dispatch(addPathToTaskFormCommand({ path }));
  }

  create() {
    this.store.dispatch(addTask());
  }
}
