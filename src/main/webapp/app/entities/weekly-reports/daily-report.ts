import { TaskReport } from '../task-report/task-report.model';

export class DailyReport {
  constructor(
    public date?: Date,
    public totalHours?: number,
    public taskReports: TaskReport[] = []
  ) { }
}
