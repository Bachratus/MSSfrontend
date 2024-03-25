export class Task {
  constructor(
    public id?: number | null,
    public name?: string | null,
    public subprojectId?: number | null,
    public subprojectCode?: string | null,
    public subprojectName?: string | null,
    public fromDate?: Date | null,
    public toDate?: Date | null,
    public hoursPredicted?: number | null
  ) { }
}
