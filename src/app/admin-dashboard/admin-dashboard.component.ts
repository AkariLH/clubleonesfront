import { Component } from '@angular/core';
import { EventTableComponent } from '../event-table/event-table.component';
import { UserTableComponent } from '../user-table/user-table.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  standalone: true,
  imports: [EventTableComponent, UserTableComponent, RouterModule],
})
export class AdminDashboardComponent {
  userRole: string = 'Administrador'; // Rol del usuario autenticado
}
