import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-selected-zone-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './selected-zone-panel.component.html',
  styleUrls: ['./selected-zone-panel.component.css'],
})
export class SelectedZonePanelComponent implements OnChanges {
  @Input() selectedZone: any | null = null;
  @Input() actividades: any[] = []; // Actividades ya filtradas para los próximos 7 días

  ngOnChanges(): void {
    // Verifica que la zona seleccionada tenga actividades asociadas.
    if (!this.selectedZone) {
      this.actividades = [];
    }
  }

  formatDay(timestamp: number): string {
    const date = new Date(timestamp); // Convierte el timestamp del backend en una fecha
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    return date.toLocaleDateString('es-ES', options);
  }
}