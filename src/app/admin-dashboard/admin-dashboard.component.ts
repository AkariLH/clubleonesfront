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

  public nombreUsuario: string = '';
  private sessionActive!: Session;
  
  constructor(private session: SessionService, private router: Router){
    this.sessionActive = this.session.getSession();
    if(this.sessionActive.tipoUsuario == 'ADMIN'){
      console.log('administrador');
      const currentHour = new Date().getHours();
      if (currentHour < 12) {
        this.nombreUsuario = `Buenos días, ${this.sessionActive.nombre}`;
      } else if (currentHour < 18) {
        this.nombreUsuario = `Buenas tardes, ${this.sessionActive.nombre}`;
      } else {
        this.nombreUsuario = `Buenas noches, ${this.sessionActive.nombre}`;
      }      
    }else if(this.sessionActive.tipoUsuario == 'ENTRENADOR'){
      this.router.navigate(['/**']);
      console.log('entrenador');
    }else{
      this.router.navigate(['/**']);
      console.log('atleta');
    }
  }

  logout() {
    this.session.clearSession(); // Eliminar la sesión (implementaremos este método en SessionService)
    this.router.navigate(['/login']); // Redirigir al login
  }
  
}
