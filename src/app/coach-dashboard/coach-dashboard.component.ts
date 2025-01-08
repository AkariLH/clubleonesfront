import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EventTableComponent } from '../event-table/event-table.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SessionService } from '../services/session.service';
import { Session } from '../classes/Session';

@Component({
  selector: 'app-coach-dashboard',
  templateUrl: './coach-dashboard.component.html',
  styleUrls: ['./coach-dashboard.component.css'],
  standalone: true,
  imports: [RouterModule, EventTableComponent,CommonModule],
})
export class CoachDashboardComponent {
  userRole: string = 'Entrenador'; // Rol del usuario autenticado
  atletas: any[] = [];
  eventos = [
    { id: 1, nombre: 'Evento 1', atletas: ['Atleta 1', 'Atleta 2', 'Atleta 3'] },
    { id: 2, nombre: 'Evento 2', atletas: ['Atleta 4', 'Atleta 5'] },
    { id: 3, nombre: 'Evento 3', atletas: ['Atleta 6', 'Atleta 7', 'Atleta 8'] },
  ];
  private sessionActive: Session;

  constructor(private session: SessionService, private router: Router){
    this.sessionActive = this.session.getSession();
    if(this.sessionActive.tipoUsuario == 'ADMIN'){
      this.router.navigate(['/**']);
      console.log('administrador');
    }else if(this.session.sessionActive.tipoUsuario == 'ENTRENADOR'){
      console.log('entrenador');
    }else{
      this.router.navigate(['/**']);
      console.log('atleta');
    }
  }

  onEventoSeleccionado(evento: any) {
    const eventoEncontrado = this.eventos.find((e) => e.id === evento.id);
    this.atletas = eventoEncontrado ? eventoEncontrado.atletas : [];
  }
}
