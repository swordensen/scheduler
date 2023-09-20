import { Component } from '@angular/core';
import {BehaviorSubject} from 'rxjs'

@Component({
  selector: 'app-digital-clock',
  templateUrl: './digital-clock.component.html',
  styleUrls: ['./digital-clock.component.scss']
})
export class DigitalClockComponent {
  interval:NodeJS.Timeout | null;
  clockString$ = new BehaviorSubject("00:00:00");
  ampmString$ = new BehaviorSubject("AM");

  ngAfterViewInit(){
    this.startClock()
  }

  startClock(){
    if(this.interval){
      clearInterval(this.interval);
      this.interval = null;
    }

    this.interval = setInterval(()=>{this.getClockString()}, 1000)

  }

  getClockString(){
    const date = new Date();
    const hours = (date.getHours() % 12) .toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    this.clockString$.next(`${hours}:${minutes}:${seconds}`)
    this.ampmString$.next((date.getHours() / 12) > 1 ? 'PM' : 'AM')
  }
}
