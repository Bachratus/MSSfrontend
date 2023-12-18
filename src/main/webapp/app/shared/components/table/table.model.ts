export interface UniversalTableColumn {
  field: string;
  header: string;
  subField?: string;
  label?: string;

  editColumnWidth?: string;
  editColumnType?: 'text' | 'date' | 'select' | 'textarea' | 'checkbox' | 'number';
  editColumnSelectOptions?: any[];
  editColumnSelectOptionLabel?: string;
  editColumnSelectOptionValue?: string;
  editColumnValidationFn?: (value: any, id: string | number | null | undefined) => string | null;
}
