/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild, forwardRef } from '@angular/core';
import { UniversalTableColumn } from './table.model';
import { debounce } from 'lodash-decorators';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Calendar } from 'primeng/calendar';

@Component({
  selector: 'mss-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TableComponent),
    multi: true
  }]
})
export class TableComponent<T> implements OnInit, OnChanges {
  @ViewChild(Calendar) calendar?: Calendar;

  @Input() values: T[] = [];
  @Input() columns: UniversalTableColumn[] = [];

  @Output() selectionChange = new EventEmitter<T | null>();
  @Input() selection: T | null = null;

  @Output() selectionsChange = new EventEmitter<T[]>();
  @Input() selections: T[] = [];
  @Input() multiSelectionDisabled = false;

  @Output() dateChange = new EventEmitter<Date>();
  @Input() date: Date = new Date();

  @Output() calendarClosure = new EventEmitter<void>();

  @Output() dateRangeChange = new EventEmitter<[start: Date, end: Date]>();
  @Input() dateRange: [start: Date, end: Date] = [new Date(), new Date()];
  @Output() datesInRangeChange = new EventEmitter<Date[]>();
  @Input() datesInRange: Date[] = [];


  @Input() dataKey = 'id';
  @Input() showCalendar = false;
  @Input() calendarType: 'date' | 'datetime' | 'daterange' | 'month' | 'week' = 'date';
  @Input() loading = false;
  @Input() minWidth = '30rem';
  @Input() selectionMode: 'single' | 'multiple' | null | undefined = 'single';

  filteredValues: T[] = [];
  filterText = '';


  ngOnInit(): void {
    this.getDatesInRange();
  }

  ngOnChanges(): void {
    this.filterDataWithNoDebounce();
  }

  emitSelectionChange(): void {
    if (this.selectionMode === 'multiple') {
      this.selectionsChange.emit(this.selections)
    } else {
      this.selectionChange.emit(this.selection);
    }
  }

  emitDateRangeChange(): void {
    this.dateRangeChange.emit(this.dateRange);
  }

  emitDatesInRangeChange(): void {
    this.datesInRangeChange.emit(this.datesInRange);
  }

  emitDateChange(): void {
    this.dateChange.emit(this.date);
  }

  @debounce(300)
  filterData(): void {
    if (this.filterText) {
      this.filteredValues = this.values.filter(item =>
        this.columns.some(column => item[column.field as keyof T]!.toString().toLowerCase().includes(this.filterText.toLowerCase()))
      );
    } else {
      this.filteredValues = this.values;
    }
  }

  filterDataWithNoDebounce(): void {
    if (this.filterText) {
      this.filteredValues = this.values.filter(item =>
        this.columns.some(column => item[column.field as keyof T]!.toString().toLowerCase().includes(this.filterText.toLowerCase()))
      );
    } else {
      this.filteredValues = this.values;
    }
  }

  onDateChange(date: Date): void {
    if (this.calendarType === 'week') {
      this.loadWeekBoundaries(date);
    }
    this.getDatesInRange();
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

  getDatesInRange(): void {
    const dateArray: Date[] = [];
    for (let dt = new Date(this.dateRange[0]); dt <= this.dateRange[1]; dt.setDate(dt.getDate() + 1)) {
      dateArray.push(new Date(dt));
    }
    this.datesInRange = [...dateArray];
    this.emitDatesInRangeChange();
  }

  onCalendarClosure(): void {
    this.calendarClosure.emit();
  }
}
