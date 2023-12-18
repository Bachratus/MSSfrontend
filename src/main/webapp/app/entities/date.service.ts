import { Injectable } from '@angular/core';
import moment from 'moment';

@Injectable({ providedIn: 'root' })
export class DateService {

  monthNames = [ 'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień' ];
  checkIfDateSmaller(firstDate: Date, secondDate: Date): boolean {
    const date1 = new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate());
    const date2 = new Date(secondDate.getFullYear(), secondDate.getMonth(), secondDate.getDate());
    return date1.getTime() <= date2.getTime();
  }

  checkIfDateBigger(firstDate: Date, secondDate: Date): boolean {
    const date1 = new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate());
    const date2 = new Date(secondDate.getFullYear(), secondDate.getMonth(), secondDate.getDate());
    return date1.getTime() > date2.getTime();
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getStringMonth(date: Date): string {
    const month = date.getMonth();
    return this.monthNames[month];
  }

  getStringWeekPeriod(date: Date, secondDate: Date): string {
    const currentDate = String(date.getDate()).padStart(2, '0');
    const week = String(secondDate.getDate()).padStart(2, '0');
    if(date.getMonth() !== secondDate.getMonth()) {
      return currentDate + ' ' + this.monthNames[date.getMonth()] + ' - ' + week + ' ' + this.monthNames[secondDate.getMonth()];
    }
    return currentDate + ' - ' + week + ' ' + this.monthNames[date.getMonth()];
  }

  calculateHours(hoursFrom: Date, hoursTo: Date): number {
    const hours = hoursTo.getHours() - hoursFrom.getHours();
    const minutes = hoursTo.getMinutes() - hoursFrom.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    const roundedTotalMinutes = Math.round(totalMinutes / 15) * 15;
    const roundedHours = Math.floor(roundedTotalMinutes / 60);
    const roundedMinutes = roundedTotalMinutes % 60;
    const decimalPart = roundedMinutes / 60;
    return roundedHours + decimalPart;
  }

  formatUnfinishedDate(dateToChange: Date, date: Date) : Date {
    const newDate: Date = moment(dateToChange).utc(true).toDate();
    newDate.setFullYear(date.getFullYear());
    newDate.setMonth(date.getMonth());
    newDate.setDate(date.getDate());
    return newDate;
  }
}
