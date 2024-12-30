import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHome, faBuilding, faCalendar, faUser } from '@fortawesome/free-solid-svg-icons';

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
}