import { Component, HostListener, OnInit } from '@angular/core';
import { DateService } from 'app/entities/date.service';
import { TaskReportService } from 'app/entities/task-report/task-report.service';
import { UserReport, WorkHoursStatus } from 'app/entities/task-report/user-report.model';
import { Chart, CategoryScale, LinearScale, LineController, PointElement, LineElement, Filler, BarElement, BarController } from 'chart.js';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { WorkingTimeRecordsDialogComponent } from './working-time-records-dialog/working-time-records-dialog.component';
Chart.register(LinearScale, CategoryScale, LineController, PointElement, LineElement, Filler, BarElement, BarController);

@Component({
  selector: 'mss-working-time-records',
  templateUrl: './working-time-records.component.html',
  styleUrls: ['./working-time-records.component.scss']
})
export class WorkingTimeRecordsComponent implements OnInit {
  date: Date = new Date();
  workHours: UserReport[] = [];
  hoursSum = 0;
  myChart: Chart | null = null;

  constructor(
    private taskReportService: TaskReportService,
    private dateService: DateService,
    private dialogService: DialogService
  ) { }

  ngOnInit(): void {
    this.loadWorkHours();
  }

  addReport(): void {
    const ref: DynamicDialogRef = this.dialogService.open(WorkingTimeRecordsDialogComponent, {
      header: 'Dodaj raport',
      width: '500px'
    });

    ref.onClose.subscribe(result => {
      if (result?.success) {
        this.loadWorkHours();
      }
    });
  }

  loadWorkHours(): void {
    const fromDate: string = this.dateService.formatDate(new Date(this.date.getFullYear(), this.date.getMonth(), 1));
    const toDate: string = this.dateService.formatDate(new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0));
    this.taskReportService.getMonthlyUserReport(fromDate, toDate).subscribe(
      {
        next: (res) => {
          this.workHours = res.body ?? [];
          this.hoursSum = 0;
          this.workHours.forEach(wh => {
            this.hoursSum += wh.hours;
          });
          this.myChart?.destroy();
          this.initChart();
        }
      }
    );
  }

  csvExport(): void {
    const fromDate: string = this.dateService.formatDate(new Date(this.date.getFullYear(), this.date.getMonth(), 1));
    const toDate: string = this.dateService.formatDate(new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0));
    this.taskReportService.getCSV(fromDate, toDate).subscribe({
      next: (response) => {
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = 'Ewidencja_czasu_pracy.csv';
        if (contentDisposition) {
          filename = this.extractFileName(contentDisposition);
        }
        if (response.body) {
          this.downloadFile(response.body, filename);
        }
      }
    });
  }

  extractFileName(inputString: string): string {
    const start = inputString.indexOf('filename="');
    if (start === -1) {
      return '';
    }
    const startIndex = start + 'filename="'.length;
    const end = inputString.indexOf('"', startIndex);
    if (end === -1) {
      return '';
    }
    return inputString.substring(startIndex, end);
  }

  downloadFile(blob: Blob, filename: string): void {
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = filename;
    downloadLink.click();
  }

  initChart(): void {
    const labels: string[] = this.workHours.map(obj => {
      const dateParts = obj.date.split('-');
      return `${dateParts[2]}.${dateParts[1]}`;
    });
    const data: number[] = this.workHours.map(obj => obj.hours);
    const workHoursStates: number[] = this.workHours.map(obj => obj.status);
    const statusColors = [
      '#FF0000',
      '#FF6347',
      '#008000',
      '#ADD8E6',
      '#0000FF',
      '#FFD700',
      '#008000',
    ];

    const backgroundColors = workHoursStates.map(status => statusColors[status - 1] || '#008000');

    const trendlineData = this.calculateTrendline(this.workHours);

    this.myChart = new Chart('canvasId', {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            data: trendlineData,
            backgroundColor: 'rgba(255, 255, 255, 0.87)',
            borderColor: 'rgba(255, 255, 255, 0.87)',
            borderWidth: 1,
            fill: false,
            type: 'line'
          },
          {
            data,
            backgroundColor: backgroundColors,
            borderColor: backgroundColors,
            borderWidth: 1,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Dni miesiąca',
              color: '#93c5fd',
            },
            grid: {
              color() {
                return '#686e75';
              },
            },
            ticks: {
              color: '#93c5fd'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Liczba przepracowanych godzin',
              color: '#93c5fd',
            },
            grid: {
              color() {
                return '#686e75';
              }
            },
            ticks: {
              color: '#93c5fd'
            }
          }
        },
      }
    });
  }


  calculateTrendline(data: UserReport[]): (number | null)[] {
    const filteredData = data.filter(item => item.status !== WorkHoursStatus.No_Hours_On_Day_Off);

    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    const len = filteredData.length;

    for (let i = 0; i < len; i++) {
      sumX += i;
      sumY += filteredData[i].hours;
      sumXY += i * filteredData[i].hours;
      sumX2 += i * i;
    }

    const slope = (len * sumXY - sumX * sumY) / (len * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / len;

    return data.map((item, i) => item.status !== WorkHoursStatus.No_Hours_On_Day_Off ? slope * i + intercept : null);
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    if (this.myChart) {
      this.myChart.resize();
    }
  }
}
