import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EventTableComponent } from '../event-table/event-table.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SessionService } from '../services/session.service';
import { Session } from '../classes/Session';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-coach-dashboard',
  templateUrl: './coach-dashboard.component.html',
  styleUrls: ['./coach-dashboard.component.css'],
  standalone: true,
  imports: [RouterModule, EventTableComponent, CommonModule, FormsModule],
})
export class CoachDashboardComponent {
  atletas: any[] = [];
  eventos = [
    { id: 1, nombre: 'Evento 1', atletas: ['Atleta 1', 'Atleta 2', 'Atleta 3'] },
    { id: 2, nombre: 'Evento 2', atletas: ['Atleta 4', 'Atleta 5'] },
    { id: 3, nombre: 'Evento 3', atletas: ['Atleta 6', 'Atleta 7', 'Atleta 8'] },
  ];
  public nombreUsuario: string = '';
  private sessionActive!: Session;

  constructor(private session: SessionService, private router: Router, private http: HttpClient) {
    this.sessionActive = this.session.getSession();
    if (this.sessionActive.tipoUsuario == 'ADMIN') {
      this.router.navigate(['/**']);
      console.log('administrador');
    } else if (this.session.sessionActive.tipoUsuario == 'ENTRENADOR') {
      console.log('entrenador');
      const currentHour = new Date().getHours();
      if (currentHour < 12) {
        this.nombreUsuario = `Buenos días, ${this.sessionActive.nombre}`;
      } else if (currentHour < 18) {
        this.nombreUsuario = `Buenas tardes, ${this.sessionActive.nombre}`;
      } else {
        this.nombreUsuario = `Buenas noches, ${this.sessionActive.nombre}`;
      }
    } else {
      this.router.navigate(['/**']);
      console.log('atleta');
    }
  }

  onEventoSeleccionado(evento: any) {
    this.http.get<any[]>(`http://localhost:8080/api/eventos/atletas/${evento.id}`)
      .pipe(
        catchError((error) => {
          console.error('Error al obtener los atletas inscritos:', error);
          console.error('Respuesta completa del error:', error.error);
          return of([]);
        })
      )
      .subscribe((data) => {
        console.log('Datos de los atletas:', data);
        this.atletas = data.map((atleta) => ({
          nombre: atleta.nombre,
          asistencia: false,
        }));
      });
  }

  registrarMetricas(atleta: any) {
    console.log('Registrar métricas para', atleta.nombre);
  }

  logout() {
    this.session.clearSession(); // Eliminar la sesión (implementaremos este método en SessionService)
    this.router.navigate(['/login']); // Redirigir al login
  }
}