import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { HostListener } from '@angular/core';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-event-table',
  templateUrl: './event-table.component.html',
  styleUrls: ['./event-table.component.css'],
  standalone: true,
  imports: [HttpClientModule, FormsModule, FontAwesomeModule,CommonModule],
})
export class EventTableComponent implements OnInit {
  @Input() userRole: string = ''; // Recibe el rol del usuario (Administrador o Entrenador)
  @Input() assignedEvents: any[] = []; // Para entrenadores: eventos asignados opcionalmente
  @Output() eventoSeleccionado = new EventEmitter<any>();

  eventos: any[] = [];
  filteredEventos: any[] = [];
  searchTerm: string = '';
  selectedStatus: string = '';
  selectedType: string = '';
  selectedDate: string = '';
  dropdownVisible: boolean = false;
  faFilter = faFilter;
  eventTypes: string[] = [];

  constructor(private router: Router, private http: HttpClient, private sessionService: SessionService) {}

  ngOnInit(): void {
    const session = this.sessionService.getSession();
      if (session) {
        this.userRole = session.tipoUsuario; // Asigna el rol del usuario
        console.log('Rol del usuario activo:', this.userRole);
      } else {
        console.warn('No se encontró una sesión activa.');
      }
    this.cargarEventos();
    this.cargarTiposDeEventos();
  
    // Actualizar estados cada minuto
    setInterval(() => {
      this.cargarEventos();
    }, 60000); // 60,000 ms = 1 minuto
  }

  cargarEventos() {
    this.http.get<any[]>('http://localhost:8080/api/eventos').subscribe(
      (response) => {
        const fechaActual = new Date();
  
        this.eventos = response.map((evento) => {
          const inicioInscripcion = new Date(evento.fechaInicioInscripciones);
          const cierreInscripcion = new Date(evento.fechaFinInscripciones);
          const inicioEvento = new Date(evento.fechaInicioEvento);
          const finEvento = new Date(evento.fechaFinEvento);
  
          const estadoActual = this.obtenerEstadoActual(
            evento.estado,
            fechaActual,
            inicioInscripcion,
            cierreInscripcion,
            inicioEvento,
            finEvento
          );
  
          // Actualiza el estado en el backend si ha cambiado
          if (estadoActual !== evento.estado) {
            this.actualizarEstadoEvento(
              {
                id: evento.idEvento, // Asegúrate de usar el campo correcto del backend
                ...evento
              },
              estadoActual
            );
          }          
  
          return {
            id: evento.idEvento,
            nombre: evento.nombre,
            fecha: `${inicioEvento.toISOString().split('T')[0]} - ${finEvento.toISOString().split('T')[0]}`,
            entrenador: evento.entrenador ? evento.entrenador.nombre : 'No asignado',
            estado: estadoActual,
            tipo: evento.tipoEvento ? evento.tipoEvento.nombre : 'No especificado',
            detalles: evento.detalles,
            modalidad: evento.modalidades,
            categoria: evento.categoria,
            costo: evento.costo,
          };
        });
  
        this.filteredEventos = [...this.eventos]; // Copia los eventos para filtros
        console.log('Eventos cargados y estados actualizados:', this.eventos);
      },
      (error) => {
        console.error('Error al cargar eventos:', error);
      }
    );
  }
    
  /*** Función para determinar el estado actual del evento.*/
  obtenerEstadoActual(
    estado: string,
    fechaActual: Date,
    inicioInscripcion: Date,
    cierreInscripcion: Date,
    inicioEvento: Date,
    finEvento: Date
  ): string {
    // Normalizar las fechas para ignorar la hora y comparar solo por día
    const actualSinHora = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate());
    const inicioInscripcionSinHora = new Date(inicioInscripcion.getFullYear(), inicioInscripcion.getMonth(), inicioInscripcion.getDate());
    const cierreInscripcionSinHora = new Date(cierreInscripcion.getFullYear(), cierreInscripcion.getMonth(), cierreInscripcion.getDate());
    const inicioEventoSinHora = new Date(inicioEvento.getFullYear(), inicioEvento.getMonth(), inicioEvento.getDate());
    const finEventoSinHora = new Date(finEvento.getFullYear(), finEvento.getMonth(), finEvento.getDate());
    
    // Si el evento está cancelado, mantenerlo como CANCELADO
    if (estado === 'CANCELADO') {
      return 'CANCELADO';
    }
  
    // Si la fecha actual está dentro del rango de inscripciones
    if (
      actualSinHora >= inicioInscripcionSinHora &&
      actualSinHora <= cierreInscripcionSinHora
    ) {
      return 'INSCRIPCIONES';
    }
  
    // Si la fecha actual está dentro del rango del evento
    if (
      actualSinHora >= inicioEventoSinHora &&
      actualSinHora <= finEventoSinHora
    ) {
      return 'EN_CURSO';
    }
  
    // Si la fecha actual está después del fin del evento
    if (actualSinHora > finEventoSinHora) {
      return 'FINALIZADO';
    }
  
    // Por defecto, si no cae en ninguno de los estados anteriores
    return 'PENDIENTE';
  }
   
  
  cargarTiposDeEventos() {
    this.http.get<any[]>('http://localhost:8080/api/tipoeventos').subscribe(
      (response) => {
        this.eventTypes = response.map((tipo) => tipo.nombre); // Suponiendo que el backend devuelve una propiedad `nombre`
        console.log('Tipos de eventos cargados:', this.eventTypes);
      },
      (error) => {
        console.error('Error al cargar tipos de eventos:', error);
      }
    );
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
    this.filteredEventos = this.eventos.filter((evento) => {
      const matchesSearchTerm = this.searchTerm
        ? evento.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
        : true;
      const matchesStatus = this.selectedStatus ? evento.estado === this.selectedStatus : true;
      const matchesType = this.selectedType ? evento.tipo === this.selectedType : true;
      const matchesDate = this.selectedDate ? evento.fecha === this.selectedDate : true;

      return matchesSearchTerm && matchesStatus && matchesType && matchesDate;
    });
    console.log('Eventos filtrados:', this.filteredEventos);
    this.dropdownVisible = false; // Oculta el menú desplegable
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.selectedType = '';
    this.selectedDate = '';
    this.filteredEventos = [...this.eventos];
  }

  cancelarEvento(evento: any) {
    const confirmacion = confirm(`¿Estás seguro de que deseas cancelar el evento "${evento.nombre}"?`);
    if (confirmacion) {
      this.http.put(`http://localhost:8080/api/eventos/${evento.id}/cancelar`, {}).subscribe(
        () => {
          evento.estado = 'CANCELADO'; // Actualiza el estado localmente
          console.log(`El evento "${evento.nombre}" ha sido cancelado.`);
        },
        (error) => {
          console.error('Error al cancelar el evento:', error);
        }
      );
    }
  }  
  
  editarEvento(evento: any) {
    this.router.navigate(['/crear-evento', evento.id]);
  }

  seleccionarEvento(evento: any) {
    this.eventoSeleccionado.emit(evento);
  }

  actualizarEstadoEvento(evento: any, nuevoEstado: string) {
    const estadosValidos = ['INSCRIPCIONES', 'EN_CURSO', 'FINALIZADO', 'CANCELADO', 'PENDIENTE'];
  
    if (!estadosValidos.includes(nuevoEstado)) {
      console.error(`Estado inválido: ${nuevoEstado}`);
      return;
    }
  
    const eventoActualizado = { ...evento, estado: nuevoEstado };
    delete eventoActualizado.id; 
  
    console.log('Datos enviados al actualizar estado:', eventoActualizado);
    this.http.put(`http://localhost:8080/api/eventos/${evento.idEvento}`, eventoActualizado)
      .subscribe(
        () => console.log(`Estado del evento actualizado a ${nuevoEstado}`),
        (error) => console.error('Error al actualizar el estado:', error)
      );
  }

  @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
      const target = event.target as HTMLElement;
      if (
        !target.closest('.filter-dropdown-container') &&
        this.dropdownVisible
      ) {
        this.dropdownVisible = false;
      }
    }
  
}
