import { TaskReportService } from '../../entities/task-report/task-report.service';
import { AfterViewInit, Component } from '@angular/core';
import { ChangeDetectorRef, OnInit, ViewChild } from '@angular/core';
import { DateService } from 'app/entities/date.service';
import { TaskService } from 'app/entities/task/task.service';
import { WeeklySummary } from 'app/entities/weekly-reports/weekly-summary.model';
import { WeeklyTaskReport } from 'app/entities/weekly-reports/weekly-task-report';
import { UniversalTableColumn } from 'app/shared/components/table/table.model';
import _ from 'lodash';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { WeeklyReportTaskDialogComponent } from './weekly-report-task-dialog/weekly-report-task-dialog.component';
import { Task } from 'app/entities/task/task.model';

@Component({
  selector: 'mss-weekly-reports',
  templateUrl: './weekly-reports.component.html',
  styleUrls: ['./weekly-reports.component.scss'],
  providers: [DialogService]
})
export class WeeklyReportsComponent implements OnInit, AfterViewInit{
  @ViewChild('dt') dt!: Table;

  weeklyReportsCols: UniversalTableColumn[] = [];
  dateRange: [start: Date, end: Date] = [new Date(), new Date()];
  datesInRange: Date[] = [];
  defaultTasksIds: number[] = [];

  weeklySummaries: WeeklySummary[] = [];
  weeklyTaskReports: WeeklyTaskReport[] = [];

  weekSummary: number[] = [];
  selectedWeeklySummary: WeeklySummary | null = null;

  dateChanged = false;
  isLoadingDetails = false;
  totalReportAccepted = false;

  constructor(
    private taskReportService: TaskReportService,
    private dateService: DateService,
    private messageService: MessageService,
    public dialogService: DialogService,
    private cd: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private taskService: TaskService
  ) { }

  ngOnInit(): void {
    this.loadWeekBoundaries(new Date());
    this.getDefaultTasksIds();
    this.initCols();
    this.loadWeeklySummaries();
  }

  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }

  loadWeekBoundaries(date: Date): void {
    const dayOfWeek: number = date.getDay();
    const offset: number = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const start: Date = new Date(date.getTime());
    start.setDate(date.getDate() - offset);
    const end: Date = new Date(start.getTime());
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59);
    this.dateRange[0] = start;
    this.dateRange[1] = end;
  }

  initCols(): void {
    this.weeklyReportsCols = [
      { field: 'name', header: 'Imię' },
      { field: 'surname', header: 'Nazwisko' },
      { field: 'hours', header: 'RBG' },
    ];
  }

  getDefaultTasksIds(): void {
    this.taskService.findDefaultTasksIds().subscribe({
      next: (res) => {
        this.defaultTasksIds = res;
      }
    });
  }

  loadWeeklySummaries(): void {
    this.taskReportService.cancelPendingSummary();
    this.taskReportService.cancelPendingDetails();
    this.clearSummaryTable();
    if (this.selectedWeeklySummary?.userId) {
      this.clearDetailsTable(true);
    }
    this.taskReportService.getWeeklySummary(
      this.dateService.formatDate(this.dateRange[0]),
      this.dateService.formatDate(this.dateRange[1])
    ).subscribe({
      next: (res) => {
        this.weeklySummaries = res.body ?? [];
        this.cd.detectChanges();
        if (this.selectedWeeklySummary?.userId) {
          const matchingSummary: WeeklySummary | undefined = this.weeklySummaries.find(summary => summary.userId === this.selectedWeeklySummary?.userId);
          if (matchingSummary) {
            this.selectedWeeklySummary = matchingSummary;
            this.loadWeeklyTaskReportsForUser();
          }
        }
      }
    });
  }

  loadWeeklyTaskReportsForUser(): void {
    this.taskReportService.cancelPendingDetails();
    this.clearDetailsTable();
    if (this.selectedWeeklySummary?.userId) {
      this.isLoadingDetails = true;
      this.taskReportService.getWeeklyTaskReportsForUser(
        this.dateService.formatDate(this.dateRange[0]),
        this.dateService.formatDate(this.dateRange[1]),
        this.selectedWeeklySummary.userId
      ).subscribe({
        next: (res) => {
          this.weeklyTaskReports = res.body ?? [];
          this.weekSummary = this.sumHoursForWeek();
          this.cd.detectChanges();
          this.dt.value.forEach(row => {
            this.dt.initRowEdit(row);
          });
        },
        complete: () => {
          this.isLoadingDetails = false;
        }
      });
    }
  }

  selectionChange(): void {
    this.loadWeeklyTaskReportsForUser();
  }

  sumHoursForWeek(): number[] {
    const weeklyHours: number[] = [0, 0, 0, 0, 0, 0, 0];
    for (const weeklyTaskReport of this.weeklyTaskReports) {
      if (weeklyTaskReport.subprojectType === 7 || weeklyTaskReport.subprojectType === 8) {
        continue;
      }
      for (const dailyReport of weeklyTaskReport.dailyReports) {
        if (dailyReport.date) {
          const date = new Date(dailyReport.date);
          const dayIndex = date.getDay() !== 0 ? date.getDay() - 1 : 6;
          for (const taskReport of dailyReport.taskReports) {
            weeklyHours[dayIndex] += taskReport.hours ? taskReport.hours : 0;
          }
        }
      }
    }
    return weeklyHours;
  }

  onCalendarClosure(): void {
    this.loadWeeklySummaries();
  }

  save(): void {
    const weeklyTaskReportsCopy: WeeklyTaskReport[] = _.cloneDeep(this.weeklyTaskReports);
    this.clearSummaryTable();
    this.clearDetailsTable(true);
    if (this.selectedWeeklySummary?.userId) {
      const userId: number = this.selectedWeeklySummary.userId;
      this.taskReportService.updateWeeklyTaskReportForUser(userId, weeklyTaskReportsCopy).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Powodzenie', detail: 'Pomyślnie zaktualizowano raporty użytkownika.' });
          this.loadWeeklySummaries();
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się zaktualizować raportów użytkownika.' });
          this.isLoadingDetails = false;
        }
      });
    }
  }

  addTask(): void {
    const ref = this.dialogService.open(WeeklyReportTaskDialogComponent, {
      header: 'Dodaj zadanie',
      width: '70%',
      height: '90vh'
    });
    ref.onClose.subscribe((task: Task | null) => {
      if (task?.id && this.selectedWeeklySummary?.userId) {
        this.taskReportService.addDefaultTaskAndGetEmptyReport(
          this.selectedWeeklySummary.userId,
          task.id,
          this.dateService.formatDate(this.dateRange[0]),
          this.dateService.formatDate(this.dateRange[1]),
        ).subscribe({
          next: (res) => {
            this.messageService.add({
              severity: 'success', summary: 'Powodzenie',
              detail: 'Pomyślnie dodano zadanie'
            });
            if (res.body) {
              this.weeklyTaskReports.push(res.body);
              this.cd.detectChanges();
              this.dt.initRowEdit(this.dt.value[this.dt.value.length - 1]);
            }
          },
          error: (res) => {
            const errorKey: string = res.error.message.split('.')[1];
            if (errorKey === 'taskassignedalready' || errorKey === 'taskreported') {
              this.messageService.add({
                severity: 'warn', summary: 'Ostrzeżenie',
                detail: 'To zadanie jest już przypisane do użytkownika'
              });
            } else if (errorKey === 'defaulttask') {
              this.messageService.add({
                severity: 'warn', summary: 'Ostrzeżenie',
                detail: 'Nie można dodać do użytkownika zadania domyślnego dla pionu.'
              });
            } else {
              this.messageService.add({
                severity: 'error', summary: 'Błąd',
                detail: 'Nie udało się dodać zadania'
              });
            }
          }
        });
      }
    });
  }

  deleteTask(weeklyTaskReport: WeeklyTaskReport): void {
    this.confirmationService.confirm({
      message: 'Czy na pewno chcesz usunąć tygodniowy raport na to zadanie?',
      acceptLabel: 'Tak',
      rejectLabel: 'Nie',
      accept: () => {
        if (this.selectedWeeklySummary?.userId) {
          this.taskReportService.deleteWeeklyReport(this.selectedWeeklySummary.userId, weeklyTaskReport).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success', summary: 'Powodzenie',
                detail: 'Pomyślnie usunięto zadanie.'
              });
              this.weeklyTaskReports = this.weeklyTaskReports.filter(report => report.taskId !== weeklyTaskReport.taskId);
            },
            error: (res) => {
              const errorKey: string = res.error.message.split('.')[1];
              if (errorKey === 'taskreported') {
                this.messageService.add({
                  severity: 'warn', summary: 'Ostrzeżenie',
                  detail: 'Nie można usunąć zadania, jeśli są do niego wpisane godziny.'
                });
              } else if (errorKey === 'sectiontaskdeletionrequest') {
                this.messageService.add({
                  severity: 'warn', summary: 'Błąd',
                  detail: 'Nie można usunąć zadania domyślnego dla działu.'
                });
              } else {
                this.messageService.add({
                  severity: 'error', summary: 'Błąd',
                  detail: 'Nie udało się usunąć zadania.'
                });
              }
            }
          });
        }
      }
    });
  }

  getColspan(): number {
    return this.datesInRange.length + 3;
  }

  clearDetailsTable(loading = false): void {
    this.weekSummary = [];
    this.weeklyTaskReports = [];
    this.isLoadingDetails = loading;
  }

  clearSummaryTable(): void {
    this.weeklySummaries = [];
  }
}
