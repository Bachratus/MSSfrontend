import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, Subject, takeUntil } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { WeeklySummary } from '../weekly-reports/weekly-summary.model';
import { WeeklyTaskReport } from '../weekly-reports/weekly-task-report';
import { UserReport } from './user-report.model';

@Injectable({ providedIn: 'root' })
export class TaskReportService {
  private resourceUrl = this.applicationConfigService.getEndpointFor('api/task-reports');

  private cancelPendingSummaryForService = new Subject<void>();
  private cancelPendingDetailsForService = new Subject<void>();

  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) { }

  getMonthlyUserReport(fromDate: string, toDate: string): Observable<HttpResponse<UserReport[]>> {
    return this.http.get<UserReport[]>(`${this.resourceUrl}/for-user/${fromDate}/${toDate}`, { observe: 'response' });
  }

  getWeeklySummary(fromDate: string, toDate: string): Observable<HttpResponse<WeeklySummary[]>> {
    return this.http
      .get<WeeklySummary[]>(`${this.resourceUrl}/weekly/${fromDate}/${toDate}`, { observe: 'response' })
      .pipe(takeUntil(this.cancelPendingSummaryForService));
  }

  getWeeklyTaskReportsForUser(fromDate: string, toDate: string, userId: number): Observable<HttpResponse<WeeklyTaskReport[]>> {
    return this.http
      .get<WeeklyTaskReport[]>(`${this.resourceUrl}/weekly/${userId}/${fromDate}/${toDate}`, { observe: 'response' })
      .pipe(takeUntil(this.cancelPendingDetailsForService));;
  }

  addDefaultTaskAndGetEmptyReport(userId: number, taskId: number, fromDate: string, toDate: string): Observable<HttpResponse<WeeklyTaskReport>> {
    return this.http.post<WeeklyTaskReport>(`${this.resourceUrl}/add-weekly-report/${userId}/${taskId}/${fromDate}/${toDate}`, {}, { observe: 'response' });
  }

  updateWeeklyTaskReportForUser(userId: number, weeklyTaskReports: WeeklyTaskReport[]): Observable<HttpResponse<{}>> {
    return this.http.put<{}>(`${this.resourceUrl}/weekly/${userId}`, weeklyTaskReports, { observe: 'response' });
  }

  deleteWeeklyReport(userId: number, weeklyReport: WeeklyTaskReport): Observable<HttpResponse<{}>> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: weeklyReport,
      observe: 'response' as 'body'
    };
    return this.http.delete<HttpResponse<{}>>(`${this.resourceUrl}/delete-weekly-report/${userId}`, httpOptions);
  }

  cancelPendingSummary(): void {
    this.cancelPendingSummaryForService.next();
  }

  cancelPendingDetails(): void {
    this.cancelPendingDetailsForService.next();
  }

  getCSV(fromDate: string, toDate: string): Observable<HttpResponse<Blob>> {
    return this.http.post(`${this.resourceUrl}/summary-csv/${fromDate}/${toDate}`, {}, {
        observe: 'response',
        responseType: 'blob'
    });
}
}
