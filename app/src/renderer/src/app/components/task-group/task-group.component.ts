import { ChangeDetectorRef, Component, Input, TrackByFunction } from '@angular/core';
import { Task, TaskGroup } from '../../../../../main/types';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { deleteTaskGroup } from 'src/app/@core/store/actions/schedule.actions';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-task-group',
  templateUrl: './task-group.component.html',
  styleUrls: ['./task-group.component.scss']
})
export class TaskGroupComponent {

  @Input() taskGroup: TaskGroup;
  @Input() expanded:boolean = false;
  constructor(private store: Store, public dialog: MatDialog, private cdr: ChangeDetectorRef) {}


  ngOnInit():void{
    console.log("TASK GROUP COMPONENT");
  }

  ngOnChanges(){
    console.log("TASK GROUP UPDATED");
    console.log(this.taskGroup);
    this.taskGroup = {...this.taskGroup};
    this.cdr.detectChanges();
  }

  _editTask(){
    console.log('this function is not ready yet');
  }

  _deleteTaskGroup(){
    this.store.dispatch(deleteTaskGroup({taskGroup: this.taskGroup}));
  }

  trackByFunction(i:number, task:Task | TaskGroup){
    return task.id;
  }
}
