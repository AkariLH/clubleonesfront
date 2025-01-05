import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css'],
})
export class EventDetailsComponent {
  @Input() events: {
    nombre: string;
    fechaInicioEvento: string;
    fechaFinEvento: string;
    categoria: string;
    modalidades: string;
    detalles: string;
  }[] = [];

  verMas(event: any): void {
    // Lógica para ver más detalles o navegar a otra página
    alert(`Ver más detalles del evento: ${event.nombre}`);
  }
}
