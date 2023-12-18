import { NgModule } from '@angular/core';
import SharedModule from 'app/shared/shared.module';
import { WeeklyReportsComponent } from './weekly-reports.component';
import { WeeklyReportTaskDialogComponent } from './weekly-report-task-dialog/weekly-report-task-dialog.component';



@NgModule({
  declarations: [
    WeeklyReportsComponent,
    WeeklyReportTaskDialogComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    WeeklyReportsComponent,
    WeeklyReportTaskDialogComponent
  ]
})
export class WeeklyReportsModule { }
