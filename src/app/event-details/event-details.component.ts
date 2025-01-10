import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SessionService } from '../services/session.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css'],
  imports: [CommonModule],
})
export class EventDetailsComponent {
  @Input() events: {
    id: number;
    nombre: string;
    fechaInicioEvento: string;
    fechaFinEvento: string;
    categoria: string;
    modalidades: string;
    detalles: string;
  }[] = [];

  constructor(private http: HttpClient, private sessionService: SessionService) {}

  verMas(event: any): void {
    alert(`Ver más detalles del evento: ${event.nombre}`);
  }

  inscribirse(event: any): void {
    const session = this.sessionService.getSession();
    if (!session || session.tipoUsuario !== 'Atleta') {
      alert('Debes iniciar sesión como atleta para inscribirte a un evento.');
      return;
    }
  
    const atletaId = session.id;
    const eventoId = event.id; 
  
    this.http
      .post(`http://localhost:8080/api/atletas/${atletaId}/eventos/${eventoId}`, {})
      .subscribe({
        next: () => {
          alert(`Te has inscrito exitosamente al evento: ${event.nombre}`);
        },
        error: (err) => {
          console.error('Error al inscribirse al evento:', err);
          alert('Hubo un error al intentar inscribirte. Por favor, inténtalo de nuevo.');
        },
      });
  }
}
