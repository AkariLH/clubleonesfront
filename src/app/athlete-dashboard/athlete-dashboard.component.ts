import { Component, OnInit } from '@angular/core';
import { SessionService } from '../services/session.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { EventTableComponent } from "../event-table/event-table.component";

@Component({
  selector: 'app-athlete-dashboard',
  standalone: true,
  templateUrl: './athlete-dashboard.component.html',
  styleUrls: ['./athlete-dashboard.component.css'],
  imports: [EventTableComponent],
})
export class AthleteDashboardComponent implements OnInit {
  greeting: string = '';
  atleta: any = {}; // Aquí se guardan los datos personales del atleta

  constructor(
    private sessionService: SessionService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const session = this.sessionService.getSession();
    if (session) {
      this.setGreeting(session.nombre);
      this.loadAthleteData(session.id); // Obtiene datos personales del atleta
    } else {
      this.router.navigate(['/login']);
    }
  }

  setGreeting(nombre: string): void {
    const hora = new Date().getHours();
    if (hora < 12) {
      this.greeting = `Buenos días, ${nombre}`;
    } else if (hora < 18) {
      this.greeting = `Buenas tardes, ${nombre}`;
    } else {
      this.greeting = `Buenas noches, ${nombre}`;
    }
  }

  loadAthleteData(id: number): void {
    this.http.get<any>(`http://localhost:8080/api/atletas/${id}`).subscribe(
      (response) => {
        this.atleta = response;
      },
      (error) => {
        console.error('Error al cargar datos del atleta:', error);
      }
    );
  }

  logout(): void {
    this.sessionService.clearSession();
    this.router.navigate(['/login']);
  }

   // Funciones para los botones
   descargarConstancias(): void {
    alert('Funcionalidad para descargar constancias aún no implementada.');
  }

  compartirLogros(): void {
    alert('Funcionalidad para compartir logros en redes sociales aún no implementada.');
  }

  editarDatos(): void {
    alert('Funcionalidad para editar datos personales aún no implementada.');
  }

  verHistorico(): void {
    alert('Funcionalidad adicional pendiente de implementar.');
  }
  
}
