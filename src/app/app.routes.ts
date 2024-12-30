import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { EventsComponent } from './events/events.component';
import { InstallationsComponent } from './installations/installations.component';
import { AthleteRegistrationComponent } from './athlete-registration/athlete-registration.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { AddEventTypeComponent } from './add-event-type/add-event-type.component';
import { AdministrationRegistrationComponent } from './administration-registration/administration-registration.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';


export const routes: Routes = [
  { path: '', component: HomeComponent }, // Página principal
  { path: 'eventos', component: EventsComponent }, // Página de eventos
  { path: 'instalaciones', component: InstallationsComponent}, 
  { path: 'registro-atletas', component: AthleteRegistrationComponent },
  { path: 'crear-evento', component: CreateEventComponent},
  {path:'agregar-tipo-evento',component:AddEventTypeComponent},
  {path: 'registro-admin',component:AdministrationRegistrationComponent},
  {path:'admin-dashboard', component:AdminDashboardComponent}
];
