import { UsersModule } from './users/users.module';
import { NgModule } from '@angular/core';
import { AuthoritiesModule } from './authorities/authorities.module';
import { WeeklyReportsModule } from './weekly-reports/weekly-reports.module';
import { WorkingTimeRecordsModule } from './working-time-records/working-time-records.module';

@NgModule({
  imports: [
    UsersModule,
    WeeklyReportsModule,
    AuthoritiesModule,
    WorkingTimeRecordsModule
  ],
  exports: [
    UsersModule,
    WeeklyReportsModule,
    AuthoritiesModule,
    WorkingTimeRecordsModule
  ]
})
export class PagesModule {}
