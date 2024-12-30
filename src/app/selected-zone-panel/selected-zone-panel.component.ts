import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-selected-zone-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './selected-zone-panel.component.html',
  styleUrls: ['./selected-zone-panel.component.css'],
})
export class SelectedZonePanelComponent {
  @Input() selectedZone: string | null = null; // Entrada para la zona seleccionada
}