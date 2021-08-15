import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'console-simulator',
  templateUrl: './terminal.html',
  styleUrls: ['./terminal.scss'],
  host: {
    '(document:keypress)': '_handleKeyPress($event)',
    '(document:keydown)': '_handleKeyDown($event)',
  },
})
export class TerminalComponent implements OnInit {
  _command: string = '';
  _logHistory: string[] = [];
  _location: string = '~';
  _controller: any = {
    commands: [],
  };
  _defaultFunctions: {
    alias: string;
    function: Function;
    description: string;
  }[];

  @Input('config') config: any;
  @Input('history') history: string[];

  @ViewChild('terminal') terminal!: ElementRef;

  constructor() {
    this._defaultFunctions = [
      {
        alias: 'help',
        function: this._help.bind(this),
        description: 'unsurprisingly, this is the help function',
      },
      {
        alias: 'goodbye',
        function: this.goodbye.bind(this),
        description: 'goodbye :(',
      },
    ];
  }
  ngOnInit() {
    this._controller = {
      ...this._controller,
      ...this.config,
    };
    this._controller.commands = this._controller.commands.concat(
      this._defaultFunctions
    );
  }

  _handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') return this._executeCommand(this._command);
    this._addLetter(event.key);
  }

  _handleKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'Backspace':
        this._removeLetter();
        break;
    }
  }

  _addLetter(letter: string) {
    this._command += letter;
  }

  _removeLetter() {
    this._command = this._command.substring(0, this._command.length - 1);
  }

  _log(text: string) {
    this._logHistory.push(text);
    setTimeout(() => {
      this.terminal.nativeElement.scrollTop = 1000000000;
    }, 100);
  }

  _executeCommand(fullCommand: string) {
    if (fullCommand.length < 1) {
      return this._log(this._location + ' > ' + fullCommand);
    }
    const command = fullCommand.toLowerCase().split(' ')[0];
    this._log(this._location + ' > ' + fullCommand);
    this._clearCommand();
    const foundFunc = this._controller.commands.find((func: any) => {
      return func.alias === command;
    });

    if (typeof foundFunc !== 'undefined') {
      const args = fullCommand.split(' ').splice(-1, 1);
      const windowLog = console.log;
      console.log = this._log.bind(this);
      foundFunc.function(args);
      console.log = windowLog;
    } else {
      this._log(
        `${command}: command not found. To see the list of available commands type "help"`
      );
    }
  }

  _clearCommand() {
    this._command = '';
  }

  _help() {
    this._log('This is the list of available commands:');
    this._controller.commands.forEach((func: any, i: number) => {
      this._log(`${i + 1}. ${func.alias}: ${func.description}`);
    });
  }

  goodbye() {
    this._log('... Oh no.');
    this._log('You say Goodbye and I say Hello, hello, hello');
    this._log("I don't know why you say Goodbye I say Hello");
  }
}
