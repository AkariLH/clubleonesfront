import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  constructor(private fb: FormBuilder) {
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
      this.tipoAgregado.emit(this.formularioTipoPersonalizado.value); // Emitimos el nuevo tipo
      this.formularioTipoPersonalizado.reset();
    } else {
      this.formularioTipoPersonalizado.markAllAsTouched();
    }
  }

  cerrarFormulario() {
    this.cerrar.emit(); // Emitimos el evento de cierre
  }
}
