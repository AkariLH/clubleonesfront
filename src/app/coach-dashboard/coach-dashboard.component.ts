import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EventTableComponent } from '../event-table/event-table.component';

@Component({
  selector: 'app-coach-dashboard',
  templateUrl: './coach-dashboard.component.html',
  styleUrls: ['./coach-dashboard.component.css'],
  standalone: true,
  imports: [RouterModule, EventTableComponent],
})
export class CoachDashboardComponent {
  userRole: string = 'Entrenador'; // Rol del usuario autenticado
}
