import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Terminal } from "xterm";
import {ipcRenderer} from 'electron'
import { Store } from '@ngrx/store';
import { Schedule, Task } from '../../../../../main/types';
import { selectTaskById } from 'src/app/@core/store/selectors/schedule.selectors';
import { first, take } from 'rxjs/operators';
import { START_LISTENING_TO_LOG_FILE, STOP_LISTENING_TO_LOG_FILE, TASK_LOG_FILE_UPDATED } from '../../../../../event-names';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-task-logs',
  templateUrl: './task-logs.component.html',
  styleUrls: ['./task-logs.component.scss']
})
export class TaskLogsComponent implements  OnInit, AfterViewInit, OnDestroy{
  public term:Terminal;
  task:Task;
  @ViewChild("xterm") xtermContainer: ElementRef;
    

  constructor( private route:ActivatedRoute, private store:Store<{schedule:Schedule}>){

  }

  ngOnInit(){
    this.route.parent?.parent?.params.subscribe(parentParams => {
      const taskId = parentParams.id
      console.log("ROUTE UPDATED", taskId);

      if(!taskId) return;
      this.store.select(selectTaskById(taskId)).pipe(take(1)).subscribe(task => {
        console.log("RECEIVED TASK");
        console.log(task);
        if(!task) return;
        this.task = task;
        this.startListeningToLogFile(task)
        this.handleLogFileUpdateEvent()
      })
    })


  }



  async onTaskFileUpdated(event:Electron.IpcRendererEvent, text:string){
    await new Promise((resolve, reject)=>{
      this.term.write('\u001B[2J', ()=>resolve(true));
    })
    this.term.write(text.replace(/\r(?!\n)/g, '\r\n'));
  }

  handleLogFileUpdateEvent(){
     ipcRenderer.on(TASK_LOG_FILE_UPDATED, this.onTaskFileUpdated.bind(this))
  }

  startListeningToLogFile(task:Task){
    console.log("START LISTENING TO LOG FILE", task.id);
    ipcRenderer.send(START_LISTENING_TO_LOG_FILE, task);
  }

  stopListeningToLogFile(){
    if(!this.task) return;
    ipcRenderer.send(STOP_LISTENING_TO_LOG_FILE,this.task)
  }

  ngOnDestroy(): void {
    console.log('ON DESTROY CALLED');
    this.stopListeningToLogFile();
    ipcRenderer.removeListener(TASK_LOG_FILE_UPDATED, this.onTaskFileUpdated.bind(this));
  }


  ngAfterViewInit(): void {
    this.term = new Terminal({
      disableStdin: true,
      convertEol: true,
      windowsPty: {
        backend: 'conpty',
        buildNumber: 19045,
      },
    });
    this.term.open(this.xtermContainer.nativeElement);
  }
}
