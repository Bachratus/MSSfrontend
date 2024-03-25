import { NgModule } from '@angular/core';
import { WorkingTimeRecordsComponent } from './working-time-records.component';
import SharedModule from 'app/shared/shared.module';
import { WorkingTimeRecordsDialogComponent } from './working-time-records-dialog/working-time-records-dialog.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [WorkingTimeRecordsComponent, WorkingTimeRecordsDialogComponent],
  exports: [WorkingTimeRecordsComponent]
})
export class WorkingTimeRecordsModule { }
