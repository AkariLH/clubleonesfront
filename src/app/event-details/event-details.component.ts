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
  selectedEvent: any = null;
  atletas: any[] = [];
  showAtletasModal: boolean = false;

  constructor(private http: HttpClient, private sessionService: SessionService, private router: Router) {}

  ngOnInit() {
    const session = this.sessionService.getSession();
    this.tipoUsuario = session?.tipoUsuario || null;
  }

  verMas(event: any): void {
    // Llamada al backend para obtener información detallada del evento si es necesario
    this.http.get(`http://localhost:8080/api/eventos/${event.id}`).subscribe({
      next: (response: any) => {
        this.selectedEvent = response; // Actualiza el evento seleccionado
  
        // Llamada adicional para obtener las actividades del evento
        this.http.get(`http://localhost:8080/api/eventos/actividades/${event.id}`).subscribe({
          next: (actividades: any) => {
            this.selectedEvent.actividades = actividades; // Asigna las actividades al evento seleccionado
            console.log('Actividades del evento:', this.selectedEvent.actividades); // Depuración
          },
          error: (err) => {
            console.error('Error al cargar actividades del evento:', err);
            alert('Hubo un error al cargar las actividades del evento.');
          },
        });
      },
      error: (err) => {
        console.error('Error al cargar detalles del evento:', err);
        alert('Hubo un error al cargar los detalles del evento.');
      },
    });
  }

  cerrarModal(): void {
    this.selectedEvent = null; // Cierra el modal
    this.showAtletasModal = false; // Cierra el modal de atletas
  }

  inscribirse(event: any): void {
    const session = this.sessionService.getSession();
    const atletaId = session.id;

    // Obtener los datos del atleta desde el backend
    this.http.get(`http://localhost:8080/api/atletas/${atletaId}`).subscribe({
      next: (response: any) => {
        const atleta = {
          fechaDeNacimiento: response.fechaDeNacimiento,
          sexo: response.sexo,
          id: atletaId
        };
        console.log('Datos del atleta obtenidos de la API:', response);

        // Verificar restricciones después de obtener los datos
        if (!this.checkRestrictions(event, atleta)) {
          alert(`No cumples con los requisitos de la categoría ${event.categoria}.`);
          return;
        }

        this.inscribirAtletaEnEvento(atletaId, event);
      },
      error: (err) => {
        console.error('Error al obtener los datos del atleta:', err);
        alert('Hubo un error al obtener los datos del atleta. Por favor, inténtalo de nuevo.');
      },
    });
  }

  inscribirAtletaEnEvento(atletaId: number, event: any): void {
    this.http
      .post(`http://localhost:8080/api/atletas/${atletaId}/eventos/${event.id}`, {})
      .subscribe({
        next: () => {
          alert(`Te has inscrito exitosamente al evento: ${event.nombre}`);
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 409) {
            console.error('Error al inscribirse al evento: El atleta ya está registrado en este evento');
            alert('Ya estás inscrito en este evento.');
          } else {
            console.error('Error al inscribirse al evento:', err);
            alert('Hubo un error al intentar inscribirte. Por favor, inténtalo de nuevo.');
          }
        },
      });
  }

  inscribirAtleta(event: any): void {
    this.showAtletasModal = true;
    this.selectedEvent = event;
    this.http.get('http://localhost:8080/api/atletas').subscribe({
      next: (response: any) => {
        this.atletas = response.map((atleta: any) => ({
          id: atleta.idAtleta, // Ajusta el nombre del campo si es diferente
          nombreCompleto: `${atleta.nombre} ${atleta.apellidoPaterno} ${atleta.apellidoMaterno}`,
          correo: atleta.correo,
          fechaDeNacimiento: atleta.fechaDeNacimiento, // Asegúrate de que este campo existe en la respuesta
          sexo: atleta.sexo // Asegúrate de que este campo existe en la respuesta
        }));        
        console.log('Lista de atletas:', this.atletas); // Verificar la lista de atletas
      },
      error: (err) => {
        console.error('Error al cargar la lista de atletas:', err);
        alert('Hubo un error al cargar la lista de atletas.');
      },
    });
  }

  seleccionarAtleta(atleta: any): void {
    if (!atleta) {
      alert('El atleta seleccionado no es válido.');
      return;
    }
  
    if (!this.checkRestrictions(this.selectedEvent, atleta)) {
      alert(`El atleta ${atleta.nombreCompleto} no cumple con los requisitos de la categoría ${this.selectedEvent?.categoria || 'desconocida'}.`);
      return;
    }
  
    const eventoId = this.selectedEvent.id;
    const atletaId = atleta.id;
  
    this.http
      .post(`http://localhost:8080/api/atletas/${atletaId}/eventos/${eventoId}`, {})
      .subscribe({
        next: () => {
          alert(`El atleta ${atleta.nombreCompleto} ha sido inscrito exitosamente al evento: ${this.selectedEvent.nombre}`);
          this.cerrarModal();
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 409) {
            console.error('Error al inscribir al atleta en el evento: El atleta ya está registrado en este evento');
            alert('El atleta ya está inscrito en este evento.');
          } else {
            console.error('Error al inscribir al atleta en el evento:', err);
            alert('Hubo un error al intentar inscribir al atleta. Por favor, inténtalo de nuevo.');
          }
        },
      });
  }  

  calculateAge(birthDate: string): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  checkRestrictions(event: any, atleta: any): boolean {
    if (!event || !atleta) {
      console.error('Datos del evento o atleta faltantes.');
      return false;
    }
  
    const categoria = event.categoria ? event.categoria.toUpperCase() : '';
    const edad = atleta.fechaDeNacimiento ? this.calculateAge(atleta.fechaDeNacimiento) : null;
    const genero = atleta.sexo ? atleta.sexo.toUpperCase() : '';
    console.log('Categoría:', categoria, 'Edad:', edad, 'Género:', genero); // Depuración
    if (!categoria || edad === null || !genero) {
      console.error('Datos faltantes: categoría, edad o género.');
      return false;
    }
  
    switch (categoria) {
      case 'FEMENIL':
        return genero === 'FEMENINO' && edad >= 15;
      case 'VARONIL':
        return genero === 'MASCULINO' && edad >= 15;
      case 'INFANTIL':
        return edad >= 6 && edad <= 14;
      case 'MIXTO':
        return edad >= 15; // Acepta tanto masculino como femenino de 15 años en adelante
      default:
        console.error('Categoría desconocida:', categoria);
        return false;
    }
  }
}