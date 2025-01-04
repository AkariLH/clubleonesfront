import { CommonModule } from '@angular/common';
import { Component, OnInit, Input,Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-table',
  templateUrl: './event-table.component.html',
  styleUrls: ['./event-table.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
})
export class EventTableComponent implements OnInit {
  @Input() userRole: string = ''; // Recibe el rol del usuario (Administrador o Entrenador)
  @Input() assignedEvents: any[] = []; // Para entrenadores: eventos asignados opcionalmente
  @Output () eventoSeleccionado = new EventEmitter<any>();

  eventos = [
    { id: 1, nombre: 'Evento 1', fecha: '2024-12-30', entrenador: 'Juan Pérez', estado: 'Activo', tipo: 'Acuatlón bajo techo' },
    { id: 2, nombre: 'Evento 2', fecha: '2024-12-15', entrenador: 'María López', estado: 'Finalizado', tipo: 'Macro-zumba' },
    { id: 3, nombre: 'Evento 3', fecha: '2024-12-20', entrenador: 'Luis Fernández', estado: 'Inscripciones', tipo: 'Carrera 5k' },
    { id: 4, nombre: 'Evento 4', fecha: '2025-01-10', entrenador: 'Juan Pérez', estado: 'Activo', tipo: 'Triatlón in-doors' },
  ];
  
  filteredEventos: any[] = [];
  searchTerm: string = '';
  selectedStatus: string = '';
  selectedType: string = '';
  selectedDate: string = '';
  dropdownVisible: boolean = false;
  selectedEvent: any = null;
  modalVisible: boolean = false;

  eventTypes: string[] = [
    'Acuatlón bajo techo',
    'Rodada in-doors',
    'Carrera 5k',
    'Corre en cinta',
    'Triatlón in-doors',
    'Maratón de nado con aletas',
    'Maratón de nado con snorkel',
    'Macro-zumba',
    'Clase de Cortesía',
    'Exhibición de avances de bebés',
    'Festivales de Clasificación Técnica',
    'Clase de Natación más grande del Mundo',
  ];
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Filtrar eventos según el rol del usuario
    if (this.userRole === 'Administrador') {
      this.filteredEventos = [...this.eventos]; // Mostrar todos los eventos
    } else if (this.userRole === 'Entrenador') {
      const entrenadorActual = 'Juan Pérez'; // Esto se puede obtener del usuario autenticado
      this.filteredEventos = this.eventos.filter((evento) => evento.entrenador === entrenadorActual);
    }
  }

  get displayedEventos() {
    return this.filteredEventos.filter((evento) => {
      const matchesSearchTerm = evento.nombre.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.selectedStatus ? evento.estado === this.selectedStatus : true;
      const matchesType = this.selectedType ? evento.tipo === this.selectedType : true;
      const matchesDate = this.selectedDate ? evento.fecha === this.selectedDate : true;

      return matchesSearchTerm && matchesStatus && matchesType && matchesDate;
    });
  }

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  aplicarFiltros() {
    console.log('Filtros aplicados:', {
      searchTerm: this.searchTerm,
      selectedStatus: this.selectedStatus,
      selectedType: this.selectedType,
      selectedDate: this.selectedDate,
    });
    this.dropdownVisible = false; // Oculta el menú desplegable
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.selectedType = '';
    this.selectedDate = '';
  }
  cancelarEvento(evento: any) {
    const confirmacion = confirm(`¿Estás seguro de que deseas cancelar el evento "${evento.nombre}"?`);
    if (confirmacion) {
      evento.estado = 'Cancelado';
      console.log(`El evento "${evento.nombre}" ha sido cancelado.`);
    }
  }  
  editarEvento(evento: any) {
    this.router.navigate(['/crear-evento', evento.id]); // Redirige usando el id del evento
  }  
  seleccionarEvento(evento:any){
    this.eventoSeleccionado.emit(evento);
  }
}


