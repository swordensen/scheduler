import { NgModule } from '@angular/core';
import { AdvancedTaskFormDialogueComponent } from './advanced-task-form-dialogue.component';
import { AdvancedTaskFormModule } from 'src/app/components/advanced-task-form/advanced-task-form.module';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [AdvancedTaskFormDialogueComponent],
  imports: [AdvancedTaskFormModule, MatDialogModule],
  entryComponents: [AdvancedTaskFormDialogueComponent],
  exports: [AdvancedTaskFormDialogueComponent],
})
export class AdvancedTaskFormDialogueModule {}
