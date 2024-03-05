import { UsersModule } from './users/users.module';
import { NgModule } from '@angular/core';
import { AuthoritiesModule } from './authorities/authorities.module';
import { WeeklyReportsModule } from './weekly-reports/weekly-reports.module';
import { WorkingTimeRecordsModule } from './working-time-records/working-time-records.module';
import { ProjectsModule } from './projects/projects.module';
import { DialogService } from 'primeng/dynamicdialog';

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
  ],
  providers:[
    DialogService
  ]
})
export class PagesModule {}
