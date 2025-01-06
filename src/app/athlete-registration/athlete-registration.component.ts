import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-athlete-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './athlete-registration.component.html',
  styleUrls: ['./athlete-registration.component.css'],
})
export class AthleteRegistrationComponent {
  athleteForm: FormGroup;
  private apiUrl = 'http://localhost:8080/api/atletas'; // URL del backend

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.athleteForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellidoPaterno: ['', [Validators.required, Validators.minLength(3)]],
      apellidoMaterno: ['', [Validators.required, Validators.minLength(3)]],
      fechaNacimiento: ['', Validators.required],
      sexo: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      peso: ['', [Validators.required, Validators.min(30), Validators.max(200)]],
      estatura: ['', [Validators.required, Validators.min(1), Validators.max(2.5)]],
    });
  }

  onSubmit(): void {
    if (this.athleteForm.valid) {
      const atleta = {
        nombre: this.athleteForm.value.nombre,
        apellidoPaterno: this.athleteForm.value.apellidoPaterno,
        apellidoMaterno: this.athleteForm.value.apellidoMaterno,
        fechaDeNacimiento: this.athleteForm.value.fechaNacimiento,
        sexo: this.athleteForm.value.sexo.toUpperCase(), // Asegúrate de que el sexo esté en mayúsculas
        correo: this.athleteForm.value.correo,
        contrasena: this.athleteForm.value.contraseña,
        peso: parseFloat(this.athleteForm.value.peso),
        estatura: parseFloat(this.athleteForm.value.estatura),
        equipoId: this.athleteForm.value.equipoId || null, // Enviar null si no hay equipo
      };
  
      console.log('Datos enviados al backend:', atleta);
  
      this.http.post('http://localhost:8080/api/atletas', atleta).subscribe({
        next: (response) => {
          console.log('Respuesta del backend:', response);
          alert('Atleta registrado con éxito');
          this.athleteForm.reset();
        },
        error: (err) => {
          console.error('Error al registrar atleta:', err);
          alert('Ocurrió un error al registrar el atleta. Revisa los datos ingresados.');
        },
      });
    } else {
      alert('Por favor, completa todos los campos correctamente.');
    }
  }  
}
