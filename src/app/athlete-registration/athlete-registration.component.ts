import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-athlete-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './athlete-registration.component.html',
  styleUrls: ['./athlete-registration.component.css'],
})
export class AthleteRegistrationComponent {
  athleteForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.athleteForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellidoPaterno: ['', [Validators.required, Validators.minLength(3)]],
      apellidoMaterno: ['', [Validators.required, Validators.minLength(3)]],
      fechaNacimiento: ['', Validators.required],
      sexo: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contraseña: ['', [Validators.required, Validators.minLength(8)]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      peso: ['', [Validators.required, Validators.min(30), Validators.max(200)]],
      estatura: ['', [Validators.required, Validators.min(1), Validators.max(2.5)]],
    });
  }

  onSubmit() {
    if (this.athleteForm.valid) {
      console.log('Datos del formulario:', this.athleteForm.value);
      alert('Registro exitoso');
      this.athleteForm.reset();
    } else {
      alert('Por favor, completa todos los campos correctamente.');
    }
  }
}