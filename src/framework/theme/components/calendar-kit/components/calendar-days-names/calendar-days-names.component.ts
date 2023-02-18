/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { ChangeDetectionStrategy, Component, OnInit, Input, HostBinding } from '@angular/core';

import { NbCalendarDay, NbCalendarSize, NbCalendarSizeValues } from '../../model';
import { NbDateService } from '../../services/date.service';


@Component({
  selector: 'nb-calendar-days-names',
  styleUrls: ['./calendar-days-names.component.scss'],
  template: `
    <div class="day" *ngFor="let day of customWeekColumn" [class.holiday]="day.isHoliday">{{ day.name }}</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NbCalendarDaysNamesComponent<D> implements OnInit {

  days: NbCalendarDay[];
  @Input() customWeekColumn: NbCalendarDay[];

  @Input() size: NbCalendarSize;
  static ngAcceptInputType_size: NbCalendarSizeValues;

  @HostBinding('class.size-large')
  get isLarge(): boolean {
    return this.size === NbCalendarSize.LARGE;
  }

  constructor(private dateService: NbDateService<D>,) {
  }

  ngOnInit() {
    const days: NbCalendarDay[] = this.createDaysNames();
    if (!this.customWeekColumn || this.customWeekColumn.length === 0) {
      this.customWeekColumn = this.shiftStartOfWeek(days);
    }
    else {
      this.customWeekColumn = this.shiftStartOfWeek(this.customWeekColumn);
    }
    this.days = this.customWeekColumn;
  }

  private createDaysNames(): NbCalendarDay[] {
    return this.dateService.getDayOfWeekNames()
      .map(this.markIfHoliday);
  }

  private shiftStartOfWeek(days: NbCalendarDay[]): NbCalendarDay[] {
    for (let i = 0; i < this.dateService.getFirstDayOfWeek(); i++) {
      days.push(days.shift());
    }

    return days;
  }

  private markIfHoliday(name, i) {
    return { name, isHoliday: i % 6 === 0 };
  }
}
