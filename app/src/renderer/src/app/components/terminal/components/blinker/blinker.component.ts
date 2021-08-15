import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-blinker",
  templateUrl: "./blinker.component.html",
  styleUrls: ["./blinker.component.scss"]
})
export class BlinkerComponent implements OnInit {
  show: boolean = true;
  blinkRate: number = 200; //milliseconds
  constructor() {}
  ngOnInit() {
    setInterval(() => {
      this.show = this.show ? false : true;
    }, 500);
  }
}
