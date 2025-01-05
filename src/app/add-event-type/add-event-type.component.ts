import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TipoEventoService } from '../services/tipo-evento.service';

@Component({
  selector: 'app-add-event-type',
  templateUrl: './add-event-type.component.html',
  styleUrls: ['./add-event-type.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // Importamos los módulos necesarios
})
export class AddEventTypeComponent {
  @Output() tipoAgregado = new EventEmitter<any>(); // Emitirá el nuevo tipo al componente padre
  @Output() cerrar = new EventEmitter<void>(); // Emitirá el evento para cerrar el modal

  formularioTipoPersonalizado: FormGroup;

  constructor(private fb: FormBuilder,private tipoEventoService: TipoEventoService) {
    this.formularioTipoPersonalizado = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      modalidad: ['', Validators.required],
      categoria: [''],
      cantidadParticipantes: [1, [Validators.required, Validators.min(1)]],
      metricas: ['', Validators.required],
    });
  }

  guardarTipoPersonalizado() {
    if (this.formularioTipoPersonalizado.valid) {
      const nuevoTipo = {
        nombre: this.formularioTipoPersonalizado.value.nombre,
        descripcion: this.formularioTipoPersonalizado.value.descripcion,
        modalidad: this.formularioTipoPersonalizado.value.modalidad,
        unidades: JSON.stringify({}), // Asumiendo que "unidades" es un objeto vacío en este caso
        categoria: this.formularioTipoPersonalizado.value.categoria,
        participantes: this.formularioTipoPersonalizado.value.cantidadParticipantes,
      };
  
      this.tipoEventoService.createTipoEvento(nuevoTipo).subscribe({
        next: (response: any) => {
          console.log('Tipo de evento creado:', response);
          this.tipoAgregado.emit(response); // Emitimos el tipo creado al componente padre
          this.formularioTipoPersonalizado.reset();
        },
        error: (err: any) => {
          console.error('Error al crear el tipo de evento:', err);
        }
      });
    } else {
      this.formularioTipoPersonalizado.markAllAsTouched(); // Marca los campos inválidos
    }
  }

  cerrarFormulario() {
    this.cerrar.emit(); // Emitimos el evento de cierre
  }
}
