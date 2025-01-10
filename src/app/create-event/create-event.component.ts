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
import { SessionService } from '../services/session.service';
import { Session } from '../classes/Session';

@Component({
  selector: 'app-create-event',
  standalone: true,
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css'],
  imports: [ReactiveFormsModule, CommonModule,FontAwesomeModule,FormsModule,AddEventTypeComponent],
})
export class CreateEventComponent {  
  isEditMode: boolean = false;
  eventForm: FormGroup;
  areasDeportivas = ['Alberca Olímpica', 'Pista de Atletismo', 'Zona de Ciclismo Indoor', 'Zona de Spa y Relajación'];
  faTriangleExclamation = faTriangleExclamation; // Asignar el ícono para usarlo en la plantilla
  tiposPredeterminados: { idTipoEvento: number; nombre: string; modalidad: string; categoria: string }[] = [];
  tipoSeleccionado: string = '';
  formularioVisible: boolean = false;
  entrenadores: { idAdministrador: number; nombre: string }[] = [];
  formularioTipoPersonalizado!: FormGroup;
  private sessionActive: Session;
  mostrarCampoNumeroIntegrantes: boolean = false;
  modalidadSeleccionada: string = '';
  categoriaSeleccionada: string = '';

  @Input() eventData: any = null;
  @Output() onSave = new EventEmitter<void>();

  private apiUrl = 'http://localhost:8080/api/eventos';

  constructor(private fb: FormBuilder, 
              private router: Router, 
              private route: ActivatedRoute, 
              private http: HttpClient, 
              private tipoEventoService: TipoEventoService, 
              private administracionService: AdministracionService,
              private session: SessionService) {
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
        entrenadorAsignado: ['', Validators.required], 
        modalidades: [''], 
        categoria: [''], 
        costo: ['', [Validators.required, Validators.min(0)]],
        detalles: ['', Validators.required],
        tipoSeleccionado: ['', Validators.required],
        cancelado: [false],
        numeroIntegrantes: [1, Validators.min(1)], 
      },
      { validators: [this.validarFechasInscripcionYEvento] }
    );
  
    this.formularioTipoPersonalizado = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      modalidad: ['', Validators.required],
      categoria: [''],
      cantidadParticipantes: [1, [Validators.required, Validators.min(1)]],
      metricas: ['', Validators.required],
    });

    this.sessionActive = this.session.getSession();
    console.log(this.sessionActive)
    if(this.sessionActive.tipoUsuario == 'ADMIN'){
      console.log('administrador');
    }else if(this.sessionActive.tipoUsuario == 'ENTRENADOR'){
      this.router.navigate(['/**']);
      console.log('entrenador');
    }else{
      this.router.navigate(['/**']);
      console.log('atleta');
    }
  }

  ngOnInit() {
    const eventId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!eventId; // Verifica si hay un ID
    console.log('Modo edición:', this.isEditMode); // Depuración
    if (this.isEditMode) {
      this.loadEvent(eventId!); // Carga los datos del evento
    }
    this.obtenerTiposEventos();
    this.obtenerEntrenadores();
  }  
  
  loadEvent(id: string) {
    this.http.get(`${this.apiUrl}/${id}`).subscribe({
      next: (evento: any) => {
        console.log('Evento cargado para edición:', evento); // Depuración
        const formatDate = (dateString: string) => new Date(dateString).toISOString().split('T')[0];
  
        // Actualiza el formulario
        this.eventForm.patchValue({
          id: evento.idEvento,
          nombre: evento.nombre,
          fechaInicioInscripcion: formatDate(evento.fechaInicioInscripciones),
          fechaCierreInscripcion: formatDate(evento.fechaFinInscripciones),
          fechaInicioEvento: formatDate(evento.fechaInicioEvento),
          fechaFinEvento: formatDate(evento.fechaFinEvento),
          modalidades: evento.modalidades || '',
          categoria: evento.categoria || '',
          costo: evento.costo,
          detalles: evento.detalles,
          tipoSeleccionado: evento.tipoEvento.idTipoEvento,
          entrenadorAsignado: evento.entrenador.idAdministrador,
          cancelado: evento.estado === 'CANCELADO',
          numeroIntegrantes: evento.numeroIntegrantes || 1,
        });
  
        // Actualiza las variables auxiliares
        this.modalidadSeleccionada = evento.modalidades || '';
        this.categoriaSeleccionada = evento.categoria || '';
      },
      error: (err) => {
        console.error('Error al cargar el evento:', err);
      },
    });
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
      nombre: ['', Validators.required] // Asegúrate de incluir este campo si está en el template
    });
  
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

  cancelar() {
    this.router.navigate(['/admin-dashboard']);
  }

  
  validarFechaFutura(isEditMode: boolean) {
    return (control: AbstractControl) => {
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

        // Si no estamos en modo edición y la fecha es anterior a hoy
        if (!isEditMode && fechaIngresada < hoy) {
          return { fechaAnterior: true }; // Error si no estamos en modo edición
        }
      }

      return null; // No hay error
    };
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
    const tipoEventoSeleccionado = this.tiposPredeterminados.find(
      (tipo) => tipo.idTipoEvento === Number(this.eventForm.value.tipoSeleccionado)
    );
  
    if (tipoEventoSeleccionado) {
      // Actualiza las propiedades modalidad y categoría
      this.modalidadSeleccionada = tipoEventoSeleccionado.modalidad;
      this.categoriaSeleccionada = tipoEventoSeleccionado.categoria;
  
      // También actualiza los valores del formulario si es necesario
      this.eventForm.patchValue({
        modalidades: tipoEventoSeleccionado.modalidad,
        categoria: tipoEventoSeleccionado.categoria,
      });
  
      // Lógica para mostrar el campo de número de integrantes
      this.mostrarCampoNumeroIntegrantes = tipoEventoSeleccionado.modalidad === 'EQUIPO';
    } else {
      // Resetea las propiedades si no hay selección válida
      this.modalidadSeleccionada = '';
      this.categoriaSeleccionada = '';
      this.mostrarCampoNumeroIntegrantes = false;
    }
  
    console.log('Modalidad seleccionada:', this.modalidadSeleccionada);
    console.log('Categoría seleccionada:', this.categoriaSeleccionada);
  }  
  
  abrirFormulario() {
    this.formularioVisible = true;
  }

  cerrarFormulario() {
    this.formularioVisible = false;
    this.formularioTipoPersonalizado.reset(); // Reiniciamos el formulario al cerrar
  }

  manejarTipoAgregado(nuevoTipo: any) {
    this.tiposPredeterminados.push(nuevoTipo); // Agrega el nuevo tipo a la lista predeterminada
    this.tipoSeleccionado = nuevoTipo.idTipoEvento; // Selecciona automáticamente el nuevo tipo
    this.cerrarFormulario(); // Cierra el modal
  }  

  obtenerTiposEventos() {
    this.tipoEventoService.getTipoEventos().subscribe(
      (data: any[]) => {
        this.tiposPredeterminados = data.map(tipo => ({
          idTipoEvento: tipo.idTipoEvento,
          nombre: tipo.nombre,
          categoria: tipo.categoria,
          modalidad: tipo.modalidad,
        }));
        console.log('Yipos de eventos procesados: ', this.tiposPredeterminados)
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

  calcularEstado(): string {
    const cancelado = this.eventForm.get('cancelado')?.value;
    const fechaActual = new Date();
    const inicioInscripcion = new Date(this.eventForm.get('fechaInicioInscripcion')?.value);
    const cierreInscripcion = new Date(this.eventForm.get('fechaCierreInscripcion')?.value);
    const inicioEvento = new Date(this.eventForm.get('fechaInicioEvento')?.value);
    const finEvento = new Date(this.eventForm.get('fechaFinEvento')?.value);
  
    if (cancelado) {
      return "CANCELADO";
    }
  
    if (fechaActual >= inicioInscripcion && fechaActual <= cierreInscripcion) {
      return "INSCRIPCIONES";
    }
  
    if (fechaActual >= inicioEvento && fechaActual <= finEvento) {
      return "EN CURSO";
    }
  
    return "FINALIZADO"; // Estado por defecto si no cumple ninguna de las condiciones anteriores
  }
  
  onSubmit() {
    if (this.eventForm.valid) {
      const fechaInicioEvento = `${this.eventForm.value.fechaInicioEvento}T08:00:00`;
      const fechaFinEvento = `${this.eventForm.value.fechaFinEvento}T12:00:00`;

      const numIntegrantes =
      this.modalidadSeleccionada === 'EQUIPO'
        ? this.eventForm.value.numeroIntegrantes
        : 1;

      const evento = {
        idEvento: this.eventForm.value.id,
        nombre: this.eventForm.value.nombre,
        fechaInicioInscripciones: this.eventForm.value.fechaInicioInscripcion,
        fechaFinInscripciones: this.eventForm.value.fechaCierreInscripcion,
        fechaInicioEvento: fechaInicioEvento,
        fechaFinEvento: fechaFinEvento,
        modalidades: this.modalidadSeleccionada,
        categoria: this.categoriaSeleccionada,
        costo: parseFloat(this.eventForm.value.costo).toFixed(2),
        horario: " ",
        detalles: this.eventForm.value.detalles,
        tipoEvento: { idTipoEvento: Number(this.eventForm.value.tipoSeleccionado) },
        entrenador: { idAdministrador: Number(this.eventForm.value.entrenadorAsignado) },
        administrador: { idAdministrador: this.sessionActive.id },
        estado: this.calcularEstado(),
        numintegrantes: numIntegrantes,
      };
  
      console.log('Evento enviado:', JSON.stringify(evento, null, 2));
  
      const method = evento.idEvento ? 'put' : 'post';
      const url = evento.idEvento ? `${this.apiUrl}/${evento.idEvento}` : this.apiUrl;
  
      this.http[method](url, evento).subscribe({
        next: () => {
          alert(evento.idEvento ? 'Evento actualizado con éxito' : 'Evento creado con éxito');
          this.router.navigate(['/admin-dashboard']);
        },
        error: (err) => {
          console.error('Error al guardar el evento:', err);
          alert('Error al guardar el evento. Verifica los datos.');
        },
      });
    } else {
      alert('Por favor, completa todos los campos obligatorios.');
    }
  }  
}