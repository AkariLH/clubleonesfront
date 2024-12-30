import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-event-table',
  templateUrl: './event-table.component.html',
  styleUrls: ['./event-table.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class EventTableComponent {
  eventos = [
    { nombre: 'Evento 1', fecha: '2024-12-30', entrenador: 'Juan Pérez', estado: 'Activo' },
    { nombre: 'Evento 2', fecha: '2024-12-15', entrenador: 'María López', estado: 'Finalizado' },
  ];
}
