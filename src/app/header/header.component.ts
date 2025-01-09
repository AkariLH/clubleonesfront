import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHome, faBuilding, faCalendar, faUser } from '@fortawesome/free-solid-svg-icons';
import { SessionService } from '../services/session.service';
import { Session } from '../classes/Session';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [FontAwesomeModule]
})
export class HeaderComponent {
  faHome = faHome;
  faBuilding = faBuilding;
  faCalendar = faCalendar;
  faUser = faUser;

  constructor(private session: SessionService, private router: Router){

  }

  checkSession() {
    try {
      const ses: Session = this.session.getSession();

      // Redirige al dashboard correspondiente según el tipo de usuario
      if (ses.tipoUsuario === 'ADMIN') {
        this.router.navigate(['/admin-dashboard']);
        console.log('Administrador');
      } else if (ses.tipoUsuario === 'ENTRENADOR') {
        this.router.navigate(['/coach-dashboard']);
        console.log('Entrenador');
      } else if (ses.tipoUsuario === 'Atleta') {
        console.log('Atleta');
      } else {
        // Si el tipo de usuario no es válido, redirige al login
        this.router.navigate(['/login']);
      }
    } catch (error) {
      // Maneja el caso en que no haya cookies o la sesión sea inválida
      console.error('Error al obtener la sesión o sesión no válida:', error);
      this.router.navigate(['/login']);
    }
  }
}