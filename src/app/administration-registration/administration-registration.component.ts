import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-administration-registration',
  templateUrl: './administration-registration.component.html',
  styleUrls: ['./administration-registration.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class AdministrationRegistrationComponent {
  userForm: FormGroup;
  roles = [
    { id: 1, name: 'Administrador' },
    { id: 2, name: 'Entrenador' },
  ];

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      rol: [null, Validators.required],
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      console.log('Datos del usuario:', this.userForm.value);
    } else {
      console.log('Formulario inválido');
      this.userForm.markAllAsTouched();
    }
  }
}
