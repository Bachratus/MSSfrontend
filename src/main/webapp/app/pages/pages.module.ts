import { UsersModule } from './users/users.module';
import { NgModule } from '@angular/core';
import { AuthoritiesModule } from './authorities/authorities.module';
import { WeeklyReportsModule } from './weekly-reports/weekly-reports.module';
import { WorkingTimeRecordsModule } from './working-time-records/working-time-records.module';
import { ProjectsModule } from './projects/projects.module';

@NgModule({
  imports: [
    UsersModule,
    WeeklyReportsModule,
    AuthoritiesModule,
    WorkingTimeRecordsModule,
    ProjectsModule
  ],
  exports: [
    UsersModule,
    WeeklyReportsModule,
    AuthoritiesModule,
    WorkingTimeRecordsModule,
    ProjectsModule
  ]
})
export class PagesModule {}
