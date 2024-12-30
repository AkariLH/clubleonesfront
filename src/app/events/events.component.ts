import { Component } from '@angular/core';
import { EventsCalendarComponent } from '../events-calendar/events-calendar.component';
import { CommonModule } from '@angular/common';
import { EventDetailsComponent } from '../event-details/event-details.component';

@Component({
  selector: 'app-events',
  standalone: true,
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
  imports: [CommonModule, EventsCalendarComponent,EventDetailsComponent],
})
export class EventsComponent {
  events: { [key: string]: string[] } = {
    '2024-12-25': ['Navidad'],
    '2025-01-01': ['Año Nuevo'],
    '2025-02-14': ['Día de San Valentín'],
  };
  

  selectedEvents: string[] = [];

  onDateSelected(date: Date) {
    const key = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    console.log('Fecha seleccionada:', key); // Verifica que la clave sea correcta
    console.log('Eventos encontrados:', this.events[key]); // Verifica los eventos encontrados
    this.selectedEvents = this.events[key] || []; // Actualiza los eventos seleccionados
  }
}