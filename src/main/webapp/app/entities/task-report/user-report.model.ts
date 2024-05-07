export enum WorkHoursStatus {
  VeryLow = 1,
  Low,
  Average,
  High,
  VeryHigh,
  Overtime_On_Day_Off,
  No_Hours_On_Day_Off
}

export class UserReport {
  constructor(
    public date: string,
    public hours: number,
    public status: WorkHoursStatus
  ) { }
}
