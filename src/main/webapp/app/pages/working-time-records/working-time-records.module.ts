import { NgModule } from '@angular/core';
import { WorkingTimeRecordsComponent } from './working-time-records.component';
import SharedModule from 'app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [WorkingTimeRecordsComponent],
  exports: [WorkingTimeRecordsComponent]
})
export class WorkingTimeRecordsModule { }
