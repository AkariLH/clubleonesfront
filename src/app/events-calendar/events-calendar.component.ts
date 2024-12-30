import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-events-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './events-calendar.component.html',
  styleUrls: ['./events-calendar.component.css'],
})
export class EventsCalendarComponent {
  @Input() events: { [key: string]: string[] } = {}; // Recibir eventos desde el padre
  @Output() dateSelected = new EventEmitter<Date>();

  months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];
  days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  currentMonth = new Date().getMonth();
  currentYear = new Date().getFullYear();
  calendarDays: (Date | null)[] = [];

  constructor() {
    this.generateCalendar();
  }

  generateCalendar() {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);

    const firstWeekDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    this.calendarDays = [];

    for (let i = 0; i < firstWeekDay; i++) {
      this.calendarDays.push(null);
    }

    for (let i = 1; i <= totalDays; i++) {
      this.calendarDays.push(new Date(this.currentYear, this.currentMonth, i));
    }
  }

  prevMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
  }

  selectDate(date: Date) {
    this.dateSelected.emit(date);
  }

  hasEvent(date: Date | null): boolean {
    if (!date) return false;

    const key = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    return key in this.events;
  }
}