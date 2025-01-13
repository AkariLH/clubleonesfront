import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectedZonePanelComponent } from '../selected-zone-panel/selected-zone-panel.component';
import { InstalacionService } from '../services/instalaciones.service';

@Component({
  selector: 'app-installations',
  standalone: true,
  templateUrl: './installations.component.html',
  styleUrls: ['./installations.component.css'],
  imports: [CommonModule,SelectedZonePanelComponent], // Importa CommonModule aquí
})
export class InstallationsComponent {
  hoveredZone: string | null = null;
  selectedZone: any[] = [];
  actividades: any[] = [];

  zones = [
    { id: 5, name: 'Alberca Olímpica', left: '5%', top: '5%', width: '40%', height: '20%', color: '#1E90FF' },
    { id: 6, name: 'Zona de Ciclismo Indoor', left: '50%', top: '5%', width: '20%', height: '20%', color: '#FFD700' },
    { id: 8, name: 'Pista de Atletismo', left: '5%', top: '30%', width: '65%', height: '15%', color: '#32CD32' },
    { id: 9, name: 'Zona de Spa y Relajación', left: '80%', top: '30%', width: '10%', height: '15%', color: '#20B2AA' },
    { id: 10, name: 'Zona de Cintas de Correr', left: '5%', top: '50%', width: '30%', height: '15%', color: '#FF4500' },
    { id: 11, name: 'Cancha de Fútbol', left: '40%', top: '50%', width: '30%', height: '15%', color: '#800080' },
    { id: 12, name: 'Auditorio', left: '75%', top: '50%', width: '20%', height: '15%', color: '#4682B4' },
    { id: 13, name: 'Zona Infantil', left: '5%', top: '70%', width: '20%', height: '10%', color: '#FF1493' },
    { id: 14, name: 'Zona de Eventos Grupales', left: '30%', top: '70%', width: '25%', height: '10%', color: '#8B0000' },
    { name: 'Estacionamiento', left: '5%', top: '85%', width: '90%', height: '10%', color: '#808080' },
    { name: 'Áreas Verdes',color: '#28A745',left: '75%',top: '5%', width: '20%',height: '20%',},
  ];

  constructor(private instalacionService: InstalacionService) {}

  onZoneClick(zone: any): void {
    this.selectedZone = zone;
    this.instalacionService.getActividadesByInstalacion(zone.id).subscribe({
      next: (actividades) => {
        console.log('Actividades recibidas:', actividades);

        // Filtra y convierte las fechas
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Establecer a medianoche
        const next7Days = new Date(today);
        next7Days.setDate(today.getDate() + 7);

        this.actividades = actividades.filter((actividad) => {
          const actividadDate = new Date(actividad.dia); // Convertir timestamp a Date
          actividadDate.setHours(0, 0, 0, 0); // Establecer a medianoche
          return actividadDate >= today && actividadDate <= next7Days; // Filtrar por rango
        });

        // Convertir fechas para el template
        this.actividades = this.actividades.map((actividad) => ({
          ...actividad,
          dia: new Date(actividad.dia).toLocaleDateString('es-ES'), // Formatear la fecha para mostrarla
        }));

        console.log('Actividades filtradas:', this.actividades);
      },
      error: (err) => {
        console.error('Error al cargar actividades:', err);
      },
    });
  }
}