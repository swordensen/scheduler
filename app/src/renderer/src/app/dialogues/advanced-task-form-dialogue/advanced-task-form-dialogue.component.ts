import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-advanced-task-form-dialogue',
  templateUrl: './advanced-task-form-dialogue.component.html',
  styleUrls: ['./advanced-task-form-dialogue.component.scss'],
})
export class AdvancedTaskFormDialogueComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<AdvancedTaskFormDialogueComponent>
  ) {}

  ngOnInit(): void {}
}
