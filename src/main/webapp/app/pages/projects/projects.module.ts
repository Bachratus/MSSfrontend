import { NgModule } from '@angular/core';
import SharedModule from 'app/shared/shared.module';
import { ProjectsComponent } from './projects.component';
import { ProjectsDialogComponent } from './users-dialog/projects-dialog.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    ProjectsComponent,
    ProjectsDialogComponent
  ],
  exports: [
    ProjectsComponent
  ]
})
export class ProjectsModule { }
