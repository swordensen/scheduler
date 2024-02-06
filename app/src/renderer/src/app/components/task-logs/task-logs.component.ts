import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Terminal } from "xterm";
import {ipcRenderer} from 'electron'
import { Store } from '@ngrx/store';
import { Schedule, Task } from '../../../../../main/types';
import { selectTaskById } from 'src/app/@core/store/selectors/schedule.selectors';
import { first } from 'rxjs/operators';
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
    

  constructor(private router:Router, private route:ActivatedRoute, private store:Store<{schedule:Schedule}>){

  }

  ngOnInit(){

    this.route.parent?.parent?.params.subscribe(parentParams => {
      console.log(parentParams);
      const taskId = parentParams.id
      if(!taskId) return;
      this.store.select(selectTaskById(taskId)).subscribe(task => {
        console.log(task);
        if(!task) return;
        this.task = task;
        this.startListeningToLogFile(task)
        this.handleLogFileUpdateEvent()
      })
    })


  }

  handleLogFileUpdateEvent(){
    ipcRenderer.on(TASK_LOG_FILE_UPDATED, (event, text)=>{
      console.log("TASK_LOG_FILE_UPDATED");
      this.term.write(text);
    })
  }

  startListeningToLogFile(task:Task){
    console.log("START LISTENING TO LOG FILE");
    ipcRenderer.send(START_LISTENING_TO_LOG_FILE, task);
  }

  stopListeningToLogFile(){
    if(!this.task) return;
    ipcRenderer.send(STOP_LISTENING_TO_LOG_FILE,this.task)
  }

  ngOnDestroy(): void {
    this.stopListeningToLogFile();
  }


  ngAfterViewInit(): void {
    this.term = new Terminal();
    this.term.open(this.xtermContainer.nativeElement);
    this.term.writeln("HELLO WORLD!");
  }
}
