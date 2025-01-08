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

  checkSession(){
    let ses: Session = this.session.getSession();
    if(ses.tipoUsuario == 'ADMIN'){
      this.router.navigate(['/admin-dashboard']);
      console.log('Administrador')
    }if(ses.tipoUsuario == 'ENTRENADOR'){
      this.router.navigate(['/coach-dashboard']);
      console.log('Entrenador')
    }else if (ses.tipoUsuario == 'Atleta'){
      console.log('atleta');
    }else{
      this.router.navigate(['/login'])
    }
  }
}