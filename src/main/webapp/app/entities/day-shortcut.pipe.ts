import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dayShortcut'
})
export class DayShortcutPipe implements PipeTransform {
  dayShortcuts: string[] = [
    'Nd',
    'Pon',
    'Wt',
    'Śr',
    'Czw',
    'Pt',
    'Sb',
  ];

  transform(date: Date | null | undefined): string {
    if (date === null || date === undefined) {
      return '-';
    }

    const tranlatedShortcut: string = this.dayShortcuts[date.getDay()] ?? '-';

    return tranlatedShortcut;
  }

}
