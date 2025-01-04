import { Component, Input,OnInit,Output,EventEmitter} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators, AbstractControl,FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'; // Importar el ícono específico
import { AddEventTypeComponent } from '../add-event-type/add-event-type.component';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TipoEventoService } from '../services/tipo-evento.service';
import { AdministracionService } from '../services/administracion.service';

@Component({
  selector: 'app-create-event',
  standalone: true,
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css'],
  imports: [ReactiveFormsModule, CommonModule,FontAwesomeModule,FormsModule,AddEventTypeComponent],
})
export class CreateEventComponent {  
  eventForm: FormGroup;
  areasDeportivas = ['Alberca Olímpica', 'Pista de Atletismo', 'Zona de Ciclismo Indoor', 'Zona de Spa y Relajación'];
  faTriangleExclamation = faTriangleExclamation; // Asignar el ícono para usarlo en la plantilla
  tiposPredeterminados: { idTipoEvento: number; nombre: string }[] = [];
  tipoSeleccionado: string = '';
  formularioVisible: boolean = false;
  entrenadores: { idAdministrador: number; nombre: string }[] = [];
  formularioTipoPersonalizado!: FormGroup;
  @Input() eventData: any = null;
  @Output() onSave = new EventEmitter<void>();

  private apiUrl = 'http://localhost:8080/api/eventos';

  constructor(private fb: FormBuilder, 
              private router: Router, 
              private route: ActivatedRoute, 
              private http: HttpClient, 
              private tipoEventoService: TipoEventoService, 
              private administracionService: AdministracionService) {
    // Inicialización del formulario principal
    this.eventForm = this.fb.group(
      {
        id: [''],
        nombre: ['', Validators.required],
        fechaInicioInscripcion: ['', [Validators.required, this.validarFechaFutura]],
        fechaCierreInscripcion: ['', [Validators.required, this.validarFechaFutura]],
        fechaInicioEvento: ['', [Validators.required, this.validarFechaFutura]],
        fechaFinEvento: ['', [Validators.required, this.validarFechaFutura]],
        horarios: this.fb.array([]),
        entrenadorAsignado: ['', Validators.required], // Campo para el entrenador
        modalidades: ['', Validators.required], 
        categoria: ['', Validators.required], 
        costo: ['', [Validators.required, Validators.min(0)]],
        detalles: ['', Validators.required],
        tipoSeleccionado: ['', Validators.required],
      },
      { validators: [this.validarFechasInscripcionYEvento] }
    );
  
    // Inicialización del formulario para agregar tipos personalizados
    this.formularioTipoPersonalizado = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      modalidad: ['', Validators.required],
      categoria: [''],
      cantidadParticipantes: [1, [Validators.required, Validators.min(1)]],
      metricas: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.obtenerTiposEventos();
    this.obtenerEntrenadores();
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.loadEvent(eventId); // Carga los datos del evento
    }
  }

  get horarios(): FormArray {
    return this.eventForm.get('horarios') as FormArray;
  }

  agregarHorario() {
    const horarioGroup = this.fb.group({
      dia: ['', [Validators.required, this.validarFechaDentroDeRango.bind(this)]],
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required],
      zonaDeportiva: ['', Validators.required],
    }, { validators: [this.validarHoras] });
  
    this.horarios.push(horarioGroup);
  }
  

  eliminarHorario(index: number) {
    this.horarios.removeAt(index);
  }

  reiniciarHorarios() {
    while (this.horarios.length !== 0) {
      this.horarios.removeAt(0);
    }
  }

  loadEvent(id: string) {
    this.http.get(`${this.apiUrl}/${id}`).subscribe({
      next: (evento: any) => {
        this.eventForm.patchValue(evento); // Llena el formulario con los datos del evento
      },
      error: (err) => {
        console.error('Error al cargar el evento:', err);
      },
    });
  }

  cancelar() {
    this.router.navigate(['/admin-dashboard']);
  }

  validarFechaFutura(control: AbstractControl) {
    const fecha = control.value;
  
    if (fecha) {
      const fechaIngresada = new Date(fecha);
      const hoy = new Date();
  
      // Restamos un día al valor de "hoy" para permitir la fecha de ayer y hoy
      const limite = new Date();
      limite.setDate(hoy.getDate() - 1); // Resta un día
      limite.setHours(0, 0, 0, 0); // Normaliza a las 00:00:00
      fechaIngresada.setHours(0, 0, 0, 0); // Normaliza también la fecha ingresada
  
      console.log('Fecha ingresada:', fechaIngresada);
      console.log('Fecha límite (ayer):', limite);
  
      // Compara si la fecha ingresada es anterior al límite
      if (fechaIngresada < limite) {
        return { fechaAnterior: true }; // Retorna error si es anterior al límite
      }
    }
  
    return null; // No hay error
  }
  
  validarFechasInscripcionYEvento(group: FormGroup) {
    const inicioInscripcion = group.get('fechaInicioInscripcion')?.value;
    const cierreInscripcion = group.get('fechaCierreInscripcion')?.value;
    const inicioEvento = group.get('fechaInicioEvento')?.value;
    const finEvento = group.get('fechaFinEvento')?.value;
  
    const errores: any = {};
  
    if (inicioInscripcion && cierreInscripcion && new Date(inicioInscripcion) > new Date(cierreInscripcion)) {
      errores.fechasInscripcionInvalidas = true;
    }
  
    if (cierreInscripcion && inicioEvento && new Date(cierreInscripcion) > new Date(inicioEvento)) {
      errores.fechasEventoInvalidas = true;
    }
  
    if (inicioEvento && finEvento && new Date(inicioEvento) > new Date(finEvento)) {
      errores.fechasEventoIncorrectas = true;
    }
  
    // Nueva validación: fechas del evento no deben estar dentro del rango de inscripción
    if (
      inicioEvento &&
      finEvento &&
      inicioInscripcion &&
      cierreInscripcion &&
      (new Date(inicioEvento) <= new Date(cierreInscripcion) || new Date(finEvento) <= new Date(cierreInscripcion))
    ) {
      errores.fechasEventoEnRangoInscripcion = true;
    }
  
    return Object.keys(errores).length > 0 ? errores : null;
  }
  
  validarFechaDentroDeRango(control: AbstractControl) {
    const dia = control.value;
    const inicioEvento = this.eventForm?.get('fechaInicioEvento')?.value;
    const finEvento = this.eventForm?.get('fechaFinEvento')?.value;
  
    if (!dia || !inicioEvento || !finEvento) {
      return null; // Si alguna de las fechas no existe, no validar
    }
  
    const diaDate = new Date(dia);
    const inicioEventoDate = new Date(inicioEvento);
    const finEventoDate = new Date(finEvento);
  
    // Validar que la fecha esté dentro del rango del evento
    if (diaDate < inicioEventoDate || diaDate > finEventoDate) {
      return { fueraDeRango: true };
    }
  
    return null;
  }
  
  validarHoras(control: AbstractControl) {
    const horaInicio = control.get('horaInicio')?.value;
    const horaFin = control.get('horaFin')?.value;

    if (horaInicio && horaFin && horaInicio >= horaFin) {
      return { horaInvalida: true };
    }

    return null;
  }
  
  manejarSeleccion() {
    if (this.tipoSeleccionado !== 'otro' && this.tipoSeleccionado.trim() !== '') {
      console.log('Tipo seleccionado:', this.tipoSeleccionado);
    }
  }

  abrirFormulario() {
    this.formularioVisible = true;
  }

  cerrarFormulario() {
    this.formularioVisible = false;
    this.formularioTipoPersonalizado.reset(); // Reiniciamos el formulario al cerrar
  }

  manejarTipoAgregado(nuevoTipo: any) {
    this.tiposPredeterminados.push(nuevoTipo.nombre); // Agregamos el nuevo tipo
    this.tipoSeleccionado = nuevoTipo.nombre; // Seleccionamos el nuevo tipo automáticamente
    this.cerrarFormulario();
  }

  obtenerTiposEventos() {
    this.tipoEventoService.getTipoEventos().subscribe(
      (data: any[]) => {
        this.tiposPredeterminados = data.map(tipo => ({
          idTipoEvento: tipo.idTipoEvento,
          nombre: tipo.nombre,
        }));
      },
      (error) => {
        console.error('Error al obtener los tipos de eventos:', error);
      }
    );
  }
    
  obtenerEntrenadores() {
    this.administracionService.getEntrenadores().subscribe(
      (data: any[]) => {
        // Filtrar solo los entrenadores
        this.entrenadores = data
          .filter((admin) => admin.rol === 'ENTRENADOR') // Filtra por rol
          .map((entrenador) => ({
            idAdministrador: entrenador.idAdministrador,
            nombre: entrenador.nombre,
          }));
      },
      (error) => {
        console.error('Error al obtener los entrenadores:', error);
      }
    );
  }
  
  

  getTipoEventoId(tipoSeleccionado: number): number {
    const tipoEvento = this.tiposPredeterminados.find(tipo => tipo.idTipoEvento === tipoSeleccionado);
    return tipoEvento ? tipoEvento.idTipoEvento : 0;
  }  

  getEntrenadorId(entrenadorSeleccionado: number): number {
    const entrenador = this.entrenadores.find(e => e.idAdministrador === entrenadorSeleccionado);
    return entrenador ? entrenador.idAdministrador : 0;
  }
  

  
  onSubmit() {
    if (this.eventForm.valid) {
      const evento = {
        nombre: this.eventForm.value.nombre,
        fechaInicioInscripciones: this.eventForm.value.fechaInicioInscripcion,
        fechaFinInscripciones: this.eventForm.value.fechaCierreInscripcion,
        fechaInicioEvento: this.eventForm.value.fechaInicioEvento,
        fechaFinEvento: this.eventForm.value.fechaFinEvento,
        modalidades: this.eventForm.value.modalidades,
        categoria: this.eventForm.value.categoria,
        costo: this.eventForm.value.costo,
        horario: "",
        detalles: this.eventForm.value.detalles,
        tipoEvento: { idTipoEvento: Number(this.eventForm.value.tipoSeleccionado) }, // Directo del formulario
        entrenador: { idAdministrador: Number(this.eventForm.value.entrenadorAsignado) }, // Directo del formulario
        administrador: { idAdministrador: 8 }, // Por ahora estático
        estado: "INSCRIPCIONES",
      };
  
      console.log('Payload enviado:', evento);
  
      this.http.post(this.apiUrl, evento).subscribe({
        next: () => {
          alert('Evento creado con éxito');
          this.router.navigate(['/admin-dashboard']);
        },
        error: (err) => {
          console.error('Error al crear el evento:', err);
        },
      });
    } else {
      alert('Por favor, completa todos los campos obligatorios.');
    }
  }
  
  
}
