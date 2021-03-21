import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { SVG, Color } from '@svgdotjs/svg.js';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss'],
})
export class ClockComponent implements AfterViewInit {
  @ViewChild('clock') clockElem: ElementRef;
  constructor() {}
  ngAfterViewInit(): void {
    this.renderClock();
    window.addEventListener('resize', () => {
      this.clockElem.nativeElement.innerHTML = '';
      this.renderClock();
    });
  }

  /************************************
  This codepen is part of the svg.js
  advent calendar. You can find all
  the pens at twitter: @svg_js
*************************************/

  renderClock() {
    const width = this.clockElem.nativeElement.clientWidth;
    const height = this.clockElem.nativeElement.clientHeight;

    if (width && height) {
      const backGroundColor = '#03DAC6';
      const hourHandColor = '#3700B3';
      const minuteHandColor = '#180edc';
      const secondHandColor = '#52008d';
      const realHeight = height - 20;

      // Create SVG and set viewbox
      // so that we zoom into the center
      const canvas = SVG()
        .addTo('#clock')
        .size(width, height)
        .viewbox(-width / 8, -realHeight / 8, width / 4, realHeight / 4);

      // Big circle
      canvas.circle(80).center(0, 0).fill('none').stroke({
        width: 1,
        color: backGroundColor,
      });

      // Hours line
      const hour = canvas.line(0, 0, 0, -20).stroke(hourHandColor);
      //   .animate(new SVG.Spring(400, 20))

      // Minutes line
      const min = canvas.line(0, 0, 0, -30).stroke(minuteHandColor);
      //   .animate(new SVG.Spring(400, 20))

      // Seconds line
      const sec = canvas.line(0, 0, 0, -38).stroke(secondHandColor);
      //   .animate(new SVG.Spring(400, 20))

      const update = () => {
        // Get time
        const d = new Date();
        const localDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
        let h = localDate.getHours();
        let m = localDate.getMinutes();
        let s = localDate.getSeconds();

        // Make sure we see partial hours
        h += m / 60;

        // Calculate angle
        const hAngle = (h / 24) * 360;
        const mAngle = (m / 60) * 360;
        const sAngle = (s / 60) * 360;

        // Rotate
        hour.transform({ rotate: hAngle, origin: [0, 0] });
        min.transform({ rotate: mAngle, origin: [0, 0] });
        sec.transform({ rotate: sAngle, origin: [0, 0] });
      };

      setInterval(update, 1000);
      update();
    }
  }

  // renderClock();
}
