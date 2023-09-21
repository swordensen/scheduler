import { Component } from '@angular/core';
import {BehaviorSubject} from 'rxjs'

@Component({
  selector: 'app-digital-clock',
  templateUrl: './digital-clock.component.html',
  styleUrls: ['./digital-clock.component.scss']
})
export class DigitalClockComponent {
  interval:NodeJS.Timeout | null;
  clockString$ = new BehaviorSubject(this.getClockString().clockString);
  ampmString$ = new BehaviorSubject(this.getClockString().isAm ? 'AM' : 'PM');

  ngAfterViewInit(){
    this.startClock()
  }

  startClock(){
    if(this.interval){
      clearInterval(this.interval);
      this.interval = null;
    }

    this.interval = setInterval(()=>{
      const {clockString, isAm} = this.getClockString()
      this.clockString$.next(clockString)
      this.ampmString$.next(isAm ? 'AM' : 'PM')
    }, 1000)

  }

  getClockString(){
    const date = new Date();
    const hours = (date.getHours() !== 12 ? date.getHours() % 12 : 12).toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const isAm = (date.getHours() / 12) < 1;

    return {
      clockString:`${hours}:${minutes}:${seconds}`,
      isAm,
    }


  }
}
