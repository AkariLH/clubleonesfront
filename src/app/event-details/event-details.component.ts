import { Component, Input, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { SessionService } from '../services/session.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-details',
  standalone: true,
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css'],
  imports: [CommonModule],
})
export class EventDetailsComponent implements OnInit {
  @Input() events: {
    id: number;
    nombre: string;
    fechaInicioEvento: string;
    fechaFinEvento: string;
    categoria: string;
    modalidades: string;
    detalles: string;
    estado: string;
  }[] = [];

  isProcessing: boolean = false;
  tipoUsuario: string | null = null;

  constructor(private http: HttpClient, private sessionService: SessionService, private router: Router) {}

  ngOnInit() {
    const session = this.sessionService.getSession();
    this.tipoUsuario = session.tipoUsuario || null;
  }

  verMas(event: any): void {
    alert(`Ver más detalles del evento: ${event.nombre}`);
  }

  inscribirse(event: any): void {
    const session = this.sessionService.getSession();
    if (!session.tipoUsuario) {
      alert('Debes iniciar sesión para inscribirte a un evento.');
      this.router.navigate(['/login']); // Redirige a la página de inicio de sesión
      return;
    }

    if (session.tipoUsuario !== 'Atleta') {
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
        error: (err: HttpErrorResponse) => {
          if(err.status === 409) {
            console.error('Error al inscribirse al evento: El atleta ya está registrado en este evento');
            alert('Ya estás inscrito en este evento.');
          } else {
            console.error('Error al inscribirse al evento:', err);
            alert('Hubo un error al intentar inscribirte. Por favor, inténtalo de nuevo.');
          }
        },
      });
  }
}