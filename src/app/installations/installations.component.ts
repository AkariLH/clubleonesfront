import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectedZonePanelComponent } from '../selected-zone-panel/selected-zone-panel.component';

@Component({
  selector: 'app-installations',
  standalone: true,
  templateUrl: './installations.component.html',
  styleUrls: ['./installations.component.css'],
  imports: [CommonModule,SelectedZonePanelComponent], // Importa CommonModule aquí
})
export class InstallationsComponent {
  hoveredZone: string | null = null;

  zones = [
    { name: 'Alberca Olímpica', left: '5%', top: '5%', width: '40%', height: '20%', color: '#1E90FF' },
    { name: 'Zona de Ciclismo Indoor', left: '50%', top: '5%', width: '20%', height: '20%', color: '#FFD700' },
    { name: 'Pista de Atletismo', left: '5%', top: '30%', width: '65%', height: '15%', color: '#32CD32' },
    { name: 'Zona de Cintas de Correr', left: '5%', top: '50%', width: '30%', height: '15%', color: '#FF4500' },
    { name: 'Cancha de Fútbol', left: '40%', top: '50%', width: '30%', height: '15%', color: '#800080' },
    { name: 'Zona Infantil', left: '5%', top: '70%', width: '20%', height: '10%', color: '#FF1493' },
    { name: 'Zona de Eventos Grupales', left: '30%', top: '70%', width: '25%', height: '10%', color: '#8B0000' },
    { name: 'Zona de Snack/Comida', left: '60%', top: '70%', width: '15%', height: '10%', color: '#FFA500' },
    { name: 'Zona de Spa y Relajación', left: '80%', top: '30%', width: '10%', height: '15%', color: '#20B2AA' },
    { name: 'Auditorio', left: '75%', top: '50%', width: '20%', height: '15%', color: '#4682B4' },
    { name: 'Estacionamiento', left: '5%', top: '85%', width: '90%', height: '10%', color: '#808080' },
    {name: 'Áreas Verdes',color: '#28A745',left: '75%',top: '5%', width: '20%',height: '20%',},
  ];
  selectedZone: string | null = null; // Define la propiedad seleccionada

  onZoneClick(zone: any) {
    this.selectedZone = zone.name; // Actualiza la zona seleccionada
  }
}