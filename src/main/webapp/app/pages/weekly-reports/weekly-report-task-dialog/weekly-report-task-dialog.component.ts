import { Component, OnInit } from '@angular/core';
import { Task } from 'app/entities/task/task.model';
import { TaskService } from 'app/entities/task/task.service';
import { UniversalTableColumn } from 'app/shared/components/table/table.model';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'mss-weekly-report-task-dialog',
  templateUrl: './weekly-report-task-dialog.component.html',
  styleUrls: ['./weekly-report-task-dialog.component.scss']
})
export class WeeklyReportTaskDialogComponent implements OnInit {
  tasks: Task[] = [];
  selectedTask: Task | null = null;
  cols: UniversalTableColumn[] = [];

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private taskService: TaskService
  ) { }

  ngOnInit(): void {
    this.initCols();
    this.loadTasks();
  }

  initCols(): void {
    this.cols = [
      { field: 'subprojectCode', header: 'Kod' },
      { field: 'projectName', header: 'Projekt' },
      { field: 'name', header: 'Zadanie' },
    ];
  }

  loadTasks(): void {
    this.taskService.findAll().subscribe({
      next: (res) => {
        this.tasks = res.body ?? [];
      }
    });
  }

  addTask():void{
    this.ref.close(this.selectedTask);
  }

  selectionChange(task: Task): void{
    this.selectedTask=task;
  }
}
