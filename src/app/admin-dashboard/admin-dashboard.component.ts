import { Component } from '@angular/core';
import { EventTableComponent } from '../event-table/event-table.component';
import { UserTableComponent } from '../user-table/user-table.component';
import { Router } from '@angular/router';
import { SessionService } from '../services/session.service';
import { Session } from '../classes/Session';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  standalone: true,
  imports: [EventTableComponent, UserTableComponent,],
})
export class AdminDashboardComponent {

  private sessionActive: Session;
  
  constructor(private session: SessionService, private router: Router){
    this.sessionActive = this.session.getSession();
    if(this.sessionActive.tipoUsuario == 'ADMIN'){
      console.log('administrador');
    }else if(this.session.sessionActive.tipoUsuario == 'ENTRENADOR'){
      this.router.navigate(['/**']);
      console.log('entrenador');
    }else{
      this.router.navigate(['/**']);
      console.log('atleta');
    }
  }
}
