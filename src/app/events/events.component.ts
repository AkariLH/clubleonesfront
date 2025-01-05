import { Component , OnInit} from '@angular/core';
import { EventsCalendarComponent } from '../events-calendar/events-calendar.component';
import { CommonModule } from '@angular/common';
import { EventDetailsComponent } from '../event-details/event-details.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-events',
  standalone: true,
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
  imports: [CommonModule, EventsCalendarComponent,EventDetailsComponent],
})
export class EventsComponent implements OnInit {
  eventos: any[] = []; // Todos los eventos desde el backend
  eventosSeleccionados: {
    nombre: string;
    fechaInicioEvento: string;
    fechaFinEvento: string;
    categoria: string;
    modalidades: string;
    detalles: string;
  }[] = []; // Detalles del día seleccionado
  eventosAgrupados: { [key: string]: any[] } = {}; // Agrupados por fecha

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarEventos();
  }

  cargarEventos() {
    this.http.get<any[]>('http://localhost:8080/api/eventos').subscribe({
      next: (eventos) => {
        this.eventos = eventos;

        // Agrupa eventos por fecha
        this.eventosAgrupados = eventos.reduce((acc, evento) => {
          const fecha = evento.fechaInicioEvento.split('T')[0]; // Extraer la fecha
          acc[fecha] = acc[fecha] || [];
          acc[fecha].push(evento);
          return acc;
        }, {});
      },
      error: (err) => {
        console.error('Error al cargar eventos:', err);
      },
    });
  }

  onDateSelected(fecha: Date) {
    const fechaClave = fecha.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    const eventosDelDia = this.eventosAgrupados[fechaClave] || [];

    // Mapear los datos a los detalles relevantes
    this.eventosSeleccionados = eventosDelDia.map((evento) => ({
      nombre: evento.nombre,
      fechaInicioEvento: evento.fechaInicioEvento,
      fechaFinEvento: evento.fechaFinEvento,
      categoria: evento.categoria || 'No especificada',
      modalidades: evento.modalidades || 'No especificada',
      detalles: evento.detalles || 'Sin detalles',
    }));
  }
}