import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addTask,
  saveTask,
  updateTaskForm,

} from 'src/app/@core/store/actions/schedule.actions';

import { remote } from 'electron';
import {

  selectTaskForm,
} from 'src/app/@core/store/selectors/taskForm.schedule';
import { Task, TriggerType, UTrigger } from '../../../../../main/types';
import { MatDialog } from '@angular/material/dialog';
import { AdvancedTaskFormDialogueComponent } from 'src/app/dialogues/advanced-task-form-dialogue/advanced-task-form-dialogue.component';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { take } from 'rxjs/operators';
import { initialTaskFormState } from '../../@core/store/reducers/taskForm.reducer';
import { resetTaskForm } from 'src/app/@core/store/actions/schedule.actions';
import { Router } from '@angular/router';
@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup 
  task: Partial<Task>;
  intervalOptions = [
    {
      display: 'daily',
      value: 86400000,
    },
    {
      display: 'weekly',
      value: 604800000,
    },
    {
      display: 'monthly',
      value: 2592000000,
    },
  ];
  triggerType: TriggerType;


  get triggers() {
    return this.taskForm.get('triggers') as FormArray<FormGroup>;
  }

  getTriggerValue() {
    return this.triggers.get('0')?.get('value')?.value;
  }

  constructor(
    private router:Router,
    private store: Store<{ taskForm: Partial<Task> }>,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.taskForm  = this.fb.group({
      arguments: this.fb.array([this.fb.group("")]),
      triggers:this.fb.array([this.fb.group({
        type: 'interval',
        value: 1000 * 60 * 60 * 24,
        next: Date.now() + (1000 * 60 * 60 * 24)
      })])
    });
    this.store
      .select(selectTaskForm)
      // .pipe(take(1))
      .subscribe((task) => {
        console.log(task);
        this.task = task;
        this.taskForm = this.fb.group({
          ...task,
          arguments: this.fb.array(task.arguments?.reduce((accumulator,argument)=>{
            if(!argument) return accumulator;
            accumulator.push(this.fb.group(argument))
            return accumulator;
          }, [] as unknown[]) ?? []),

          pids: [task.pids],
          triggers: this.fb.array(task.triggers?.reduce((accumulator,trigger)=>{
              if(!trigger) return accumulator;
              accumulator.push(this.fb.group(trigger))
              return accumulator;
            }, [] as unknown[]) ?? [])

        });
        this.triggerType = task.triggers ? task.triggers[0].type : 'interval';
        this.taskForm.valueChanges.subscribe((taskForm) => {
          this.store.dispatch(updateTaskForm({ taskForm }));
        });
      });

    /**
     * this listens for the trigger control type to change then will set some default values
     */
    this.triggers.controls[0]
      .get('type')
      ?.valueChanges.subscribe((type: TriggerType) => {
        if (type !== this.triggerType) {
          switch (type) {
            case 'startup':
              this.triggers.controls[0].get('value')?.setValue('');
              break;
            case 'CRON':
              this.triggers.controls[0].get('value')?.setValue('* * * * * *');
              break;
            case 'interval':
              this.triggers.controls[0].get('value')?.setValue(86400000);
          }
        }
      });

  }
  advanced() {
    this.dialog.open(AdvancedTaskFormDialogueComponent);
  }

  async browse() {
    const dialogResponse = await remote.dialog.showOpenDialog({
      properties: ['openFile', 'showHiddenFiles'],
    });
    const path = `"${dialogResponse.filePaths[0]}"`;
    const commandControl = this.taskForm.get('command');
    const commandControlValue = commandControl?.value;
    commandControl?.setValue(commandControlValue + path);
  }

  reset(){
    this.store.dispatch(resetTaskForm())
    this.taskForm.setValue(initialTaskFormState);
    this.router.navigate(['/']);
  }

  create() {
    this.store.dispatch(addTask());
    this.taskForm.setValue(initialTaskFormState);
  }

  save(){
    this.store.dispatch(saveTask());
  }
}
