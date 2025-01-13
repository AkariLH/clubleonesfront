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
    id: number;
    nombre: string;
    fechaInicioEvento: string;
    fechaFinEvento: string;
    categoria: string;
    modalidades: string;
    detalles: string;
    estado: string;
  }[] = []; // Detalles del día seleccionado
  eventosAgrupados: { [key: string]: any[] } = {}; // Agrupados por fecha

  constructor(private http: HttpClient) {}

    ngOnInit() {
    this.http.get<any[]>('http://localhost:8080/api/eventos').subscribe((eventos) => {
      this.eventosAgrupados = {};
  
      eventos.forEach((evento) => {
        if (evento.estado === 'CANCELADO') return; // Filtra eventos cancelados
  
        const fechaInicio = new Date(evento.fechaInicioEvento);
        const fechaFin = new Date(evento.fechaFinEvento);
  
        // Normalizamos las fechas para que queden sin horas
        fechaInicio.setHours(0, 0, 0, 0);
        fechaFin.setHours(0, 0, 0, 0);
  
        // Iterar desde la fecha de inicio hasta la fecha de fin
        for (
          let fecha = new Date(fechaInicio);
          fecha <= fechaFin;
          fecha.setDate(fecha.getDate() + 1)
        ) {
          const claveFecha = fecha.toISOString().split('T')[0]; // Formato 'YYYY-MM-DD'
          if (!this.eventosAgrupados[claveFecha]) {
            this.eventosAgrupados[claveFecha] = [];
          }
  
          this.eventosAgrupados[claveFecha].push({
            idEvento: evento.idEvento,
            nombre: evento.nombre,
            fechaInicioEvento: evento.fechaInicioEvento,
            fechaFinEvento: evento.fechaFinEvento,
            categoria: evento.categoria,
            modalidad: evento.modalidades,
            detalles: evento.detalles,
            estado: evento.estado,
          });
        }
      });
  
      console.log('Eventos agrupados por fecha:', this.eventosAgrupados);
    });
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
  
    this.eventosSeleccionados = eventosDelDia
      .filter(evento => evento.estado !== 'CANCELADO')
      .map((evento) => ({
        id: evento.idEvento, 
        nombre: evento.nombre,
        fechaInicioEvento: evento.fechaInicioEvento,
        fechaFinEvento: evento.fechaFinEvento,
        categoria: evento.categoria || 'No especificada',
        modalidades: evento.modalidad || 'No especificada',
        detalles: evento.detalles || 'Sin detalles',
        estado: evento.estado,
      }));
  }
}