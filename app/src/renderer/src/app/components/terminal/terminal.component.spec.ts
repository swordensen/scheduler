import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ConsoleSimulator } from "./angular2-console-simulator.component";

describe("Angular2ConsoleSimulatorComponent", () => {
  let component: ConsoleSimulator;
  let fixture: ComponentFixture<ConsoleSimulator>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConsoleSimulator],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsoleSimulator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
