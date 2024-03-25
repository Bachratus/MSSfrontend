import { Component, OnInit } from '@angular/core';
import { UniversalTableColumn } from 'app/shared/components/table/table.model';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProjectsDialogComponent } from './users-dialog/projects-dialog.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Project } from 'app/entities/project/project.model';
import { Subproject } from 'app/entities/subproject/subproject.model';
import { Task } from 'app/entities/task/task.model';
import { ProjectService } from 'app/entities/project/project.service';
import { SubprojectService } from 'app/entities/subproject/subproject.service';
import { TaskService } from 'app/entities/task/task.service';

@Component({
  selector: 'mss-users',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  providers: [DialogService],
})
export class ProjectsComponent implements OnInit {
  show: 'projects' | 'subprojects' | 'tasks' = 'projects';

  projects: Project[] = [];
  selectedProject: Project | null = null;
  loadingProjects = false;

  subprojects: Subproject[] = [];
  selectedSubproject: Subproject | null = null;
  loadingSubprojects = false;

  tasks: Task[] = [];
  selectedTask: Task | null = null;
  loadingTasks = false;

  projectCols: UniversalTableColumn[] = [
    { field: 'name', header: 'Nazwa' },
    { field: 'code', header: 'Kod' },
    { field: 'dateFrom', header: 'Data rozpoczęcia' },
    { field: 'dateTo', header: 'Data zakończenia' },
  ];

  subprojectCols: UniversalTableColumn[] = [
    { field: 'name', header: 'Nazwa' },
    { field: 'code', header: 'Kod' },
    { field: 'dateFrom', header: 'Data rozpoczęcia' },
    { field: 'dateTo', header: 'Data zakończenia' },
  ];

  taskCols: UniversalTableColumn[] = [
    { field: 'name', header: 'Nazwa' },
    { field: 'fromDate', header: 'Data rozpoczęcia' },
    { field: 'toDate', header: 'Data zakończenia' },
  ];

  constructor(
    public dialogService: DialogService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private projectService: ProjectService,
    private subprojectService: SubprojectService,
    private taskService: TaskService
  ) { }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loadingProjects = true;
    this.projectService.findAll().subscribe({
      next: (res) => {
        this.projects = res.body ?? [];
        this.loadingProjects = false;
      },
      error: () => {
        this.loadingProjects = false;
      },
    })
  }

  loadSubprojects(): void {
    if (!this.selectedProject?.id) { return; }
    this.loadingSubprojects = true;
    this.subprojectService.findAllForProject(this.selectedProject.id).subscribe({
      next: (res) => {
        this.subprojects = res.body ?? [];
        this.loadingSubprojects = false;
      },
      error: () => {
        this.loadingSubprojects = false;
      },
    })
  }

  loadTasks(): void {
    if (!this.selectedSubproject?.id) { return; }
    this.loadingTasks = true;
    this.taskService.findAllForSubproject(this.selectedSubproject.id).subscribe({
      next: (res) => {
        this.tasks = res.body ?? [];
        this.loadingTasks = false;
      },
      error: () => {
        this.loadingTasks = false;
      },
    })
  }

  toggleView(view: 'projects' | 'subprojects' | 'tasks'): void {
    this.show = view;
  }

  addProject(): void {
    const ref: DynamicDialogRef = this.dialogService.open(ProjectsDialogComponent, {
      header: 'Dodaj projekt',
      data: {
        type: 'addProject'
      }
    });

    ref.onClose.subscribe(result => {
      if (result?.success) {
        this.loadProjects();
      }
    });
  }

  editProject(): void {
    const ref: DynamicDialogRef = this.dialogService.open(ProjectsDialogComponent, {
      header: 'Edytuj projekt',
      data: {
        type: 'editProject',
        obj: this.selectedProject
      }
    });

    ref.onClose.subscribe(result => {
      if (result?.success) {
        this.loadProjects();
      }
    });
  }

  deleteProject(): void {
    if (this.selectedProject?.id) {
      this.confirmationService.confirm({
        message: 'Czy na pewno chcesz usunąć ten projekt?',
        header: 'Potwierdź usunięcie',
        acceptLabel: 'Tak',
        rejectLabel: 'Nie',
        accept: () => {
          this.projectService.deleteProject(this.selectedProject!.id!).subscribe({
            next: () => {
              this.messageService.add({ severity: 'success', summary: 'Powodzenie', detail: 'Pomyślnie usunięto projekt.' });
              this.selectedProject = null;
              this.loadProjects();
            },
            error: () => {
              this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się usunąć projektu.' });
            }
          });
        }
      });
    }
  }

  addSubproject(): void {
    const ref: DynamicDialogRef = this.dialogService.open(ProjectsDialogComponent, {
      header: 'Dodaj podprojekt',
      data: {
        type: 'addSubproject',
        parent: this.selectedProject
      }
    });

    ref.onClose.subscribe(result => {
      if (result?.success) {
        this.loadSubprojects();
      }
    });
  }

  editSubproject(): void {
    const ref: DynamicDialogRef = this.dialogService.open(ProjectsDialogComponent, {
      header: 'Edytuj podprojekt',
      data: {
        type: 'editSubproject',
        obj: this.selectedSubproject,
        parent: this.selectedProject
      }
    });

    ref.onClose.subscribe(result => {
      if (result?.success) {
        this.loadSubprojects();
      }
    });
  }

  deleteSubproject(): void {
    if (this.selectedProject?.id) {
      this.confirmationService.confirm({
        message: 'Czy na pewno chcesz usunąć ten podprojekt?',
        header: 'Potwierdź usunięcie',
        acceptLabel: 'Tak',
        rejectLabel: 'Nie',
        accept: () => {
          this.subprojectService.deleteSubproject(this.selectedSubproject!.id!).subscribe({
            next: () => {
              this.messageService.add({ severity: 'success', summary: 'Powodzenie', detail: 'Pomyślnie usunięto podprojekt.' });
              this.selectedSubproject = null;
              this.loadSubprojects();
            },
            error: () => {
              this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się usunąć podprojektu.' });
            }
          });
        }
      });
    }
  }

  addTask(): void {
    const ref: DynamicDialogRef = this.dialogService.open(ProjectsDialogComponent, {
      header: 'Dodaj zadanie',
      data: {
        type: 'addTask',
        parent: this.selectedSubproject
      }
    });

    ref.onClose.subscribe(result => {
      if (result?.success) {
        this.loadTasks();
      }
    });
  }

  editTask(): void {
    const ref: DynamicDialogRef = this.dialogService.open(ProjectsDialogComponent, {
      header: 'Edytuj zadanie',
      data: {
        type: 'editTask',
        obj: this.selectedTask,
        parent: this.selectedSubproject
      }
    });

    ref.onClose.subscribe(result => {
      if (result?.success) {
        this.loadTasks();
      }
    });
  }

  deleteTask(): void {
    if (this.selectedProject?.id) {
      this.confirmationService.confirm({
        message: 'Czy na pewno chcesz usunąć to zadanie?',
        header: 'Potwierdź usunięcie',
        acceptLabel: 'Tak',
        rejectLabel: 'Nie',
        accept: () => {
          this.taskService.deleteTask(this.selectedTask!.id!).subscribe({
            next: () => {
              this.messageService.add({ severity: 'success', summary: 'Powodzenie', detail: 'Pomyślnie usunięto zadanie.' });
              this.selectedTask = null;
              this.loadTasks();
            },
            error: () => {
              this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się usunąć zadania.' });
            }
          });
        }
      });
    }
  }
}
