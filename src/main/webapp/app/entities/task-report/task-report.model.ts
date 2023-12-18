export class TaskReport {
  constructor(
    public id?: number,
    public projectId?: number,
    public subprojectId?: number,
    public percent?: number | null,
    public status?: number | null,
    public description?: string | null,
    public date?: Date | null,
    public hours?: number | null,
    public flags?: number | null,
    public statusName?: string | null
    ) {}
}
