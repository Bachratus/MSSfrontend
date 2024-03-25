import { Component, OnInit } from '@angular/core';
import { Project } from 'app/entities/project/project.model';
import { ProjectService } from 'app/entities/project/project.service';
import { Subproject } from 'app/entities/subproject/subproject.model';
import { SubprojectService } from 'app/entities/subproject/subproject.service';
import { TaskReport } from 'app/entities/task-report/task-report.model';
import { TaskReportService } from 'app/entities/task-report/task-report.service';
import { Task } from 'app/entities/task/task.model';
import { TaskService } from 'app/entities/task/task.service';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'mss-working-time-records-dialog',
  templateUrl: './working-time-records-dialog.component.html',
  styleUrls: ['./working-time-records-dialog.component.scss']
})
export class WorkingTimeRecordsDialogComponent implements OnInit {
  projects: Project[] = [];
  selectedProject: Project | null = null;

  subprojects: Subproject[] = [];
  selectedSubproject: Subproject | null = null;

  tasks: Task[] = [];
  selectedTask: Task | null = null;

  date: Date = new Date();

  hours = 0;

  overtime = 0;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public messageService: MessageService,
    private projectService: ProjectService,
    private subprojectService: SubprojectService,
    private taskService: TaskService,
    private taskReportService: TaskReportService
  ) { }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService.findAll().subscribe({
      next: (res) => {
        this.projects = res.body ?? [];
      }
    })
  }

  projectSelected(): void {
    this.selectedSubproject = null;
    this.selectedTask = null;
    this.tasks = [];
    this.subprojects = [];
    this.loadSubprojects();
  }

  subprojectSelected(): void {
    this.selectedTask = null;
    this.tasks = [];
    this.loadTasks();
  }

  loadSubprojects(): void {
    if (!this.selectedProject?.id) { return; }
    this.subprojectService.findAllForProject(this.selectedProject.id).subscribe({
      next: (res) => {
        this.subprojects = res.body ?? [];
        if (this.subprojects.length === 1) {
          this.selectedSubproject = this.subprojects[0];
        }
      }
    });
  }

  loadTasks(): void {
    if (!this.selectedSubproject?.id) { return; }
    this.taskService.findAllForSubproject(this.selectedSubproject.id).subscribe({
      next: (res) => {
        this.tasks = res.body ?? [];
        if (this.tasks.length === 1) {
          this.selectedTask = this.tasks[0];
        }
      }
    });
  }

  save(): void {
    if (!this.selectedProject?.id || !this.selectedSubproject?.id || !this.selectedTask?.id) { return; }
    const dto = new TaskReport(undefined, this.selectedProject.id, this.selectedSubproject.id, this.selectedTask.id, undefined,
      null, null, null, this.date, this.hours, null, null);
    this.taskReportService.addReport(dto).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Powodzenie', detail: 'Pomyślnie utworzono raport.' });
        this.ref.close({ success: true });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się utworzyć raportu.' });
      }
    });
  }
}
