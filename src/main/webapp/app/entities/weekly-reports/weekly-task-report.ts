import { DailyReport } from './daily-report';

export class WeeklyTaskReport {
  constructor(
    public taskId?: number,
    public projectName?: string,
    public subprojectName?: string,
    public taskName?: string,
    public subprojectCode?: string,
    public dailyReports: DailyReport[] = [],
    public subprojectType?: number
  ) { }
}
