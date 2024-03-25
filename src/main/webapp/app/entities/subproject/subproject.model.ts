export class Subproject {
    constructor(
        public id?: number | null,
        public name?: string | null,
        public code?: string | null,
        public dateFrom?: Date | null,
        public dateTo?: Date | null,
        public hoursPredicted?: number | null,
        public subprojectTypeId?: number | null,
        public projectId?: number | null,
    ) { }
}
