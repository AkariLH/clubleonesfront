import { Component, OnInit } from '@angular/core';
import { SessionService } from '../services/session.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { EventTableComponent } from '../event-table/event-table.component';
import { Session } from '../classes/Session';

@Component({
  selector: 'app-athlete-dashboard',
  standalone: true,
  templateUrl: './athlete-dashboard.component.html',
  styleUrls: ['./athlete-dashboard.component.css'],
  imports: [EventTableComponent],
})
export class AthleteDashboardComponent implements OnInit {
  greeting: string = '';
  atleta: any = {
    nombreCompleto: '',
    edad: 0,
    sexo: '',
    peso: 0,
    estatura: 0,
    imc: 0,
  };

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
        this.atleta.nombreCompleto = `${response.nombre} ${response.apellidoPaterno} ${response.apellidoMaterno}`;
        this.atleta.edad = this.calculateAge(new Date(response.fechaDeNacimiento));
        this.atleta.peso = response.peso;
        this.atleta.estatura = response.estatura;
        this.atleta.imc = this.calculateIMC(response.peso, response.estatura);
        this.atleta.sexo = response.sexo;
      },
      (error) => {
        console.error('Error al cargar datos del atleta:', error);
      }
    );
  }

  calculateAge(birthDate: Date): number {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  }

  calculateIMC(peso: number, estatura: number): number {
    return parseFloat((peso / (estatura * estatura)).toFixed(2));
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
