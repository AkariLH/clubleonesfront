import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-athlete-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './athlete-registration.component.html',
  styleUrls: ['./athlete-registration.component.css'],
})
export class AthleteRegistrationComponent implements OnInit {
  athleteForm: FormGroup;
  private apiUrl = 'http://localhost:8080/api/atletas'; // URL del backend
  private atletaId: number | null = null;
  isEditMode = false; // Indica si está en modo edición

  constructor(private fb: FormBuilder, 
              private http: HttpClient, 
              private router: Router,
              private route: ActivatedRoute,
              private location: Location
            ) {
    this.athleteForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellidoPaterno: ['', [Validators.required, Validators.minLength(3)]],
      apellidoMaterno: ['', [Validators.required, Validators.minLength(3)]],
      fechaNacimiento: ['', Validators.required],
      sexo: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      peso: ['', [Validators.required, Validators.min(30), Validators.max(200)]],
      estatura: ['', [Validators.required, Validators.min(1), Validators.max(2.5)]],
    });
  }
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.atletaId = +id;
        this.loadAtleta(this.atletaId);
      }
    });
  }
  
  loadAtleta(id: number): void {
    this.http.get<any>(`${this.apiUrl}/${id}`).subscribe((atleta) => {
      const fechaNacimiento = new Date(atleta.fechaDeNacimiento).toISOString().split('T')[0];
      this.athleteForm.patchValue({
        nombre: atleta.nombre,
        apellidoPaterno: atleta.apellidoPaterno,
        apellidoMaterno: atleta.apellidoMaterno,
        fechaNacimiento: fechaNacimiento,
        sexo: atleta.sexo.toUpperCase(),
        correo: atleta.correo,
        contrasena: '', // No se muestra la contraseña, pero si la podemos editar
        telefono: atleta.telefono || '',
        peso: atleta.peso,
        estatura: atleta.estatura,
      });
    });
  }

  onSubmit(): void {
    if (this.athleteForm.valid) {
      const atleta = {
        nombre: this.athleteForm.value.nombre,
        apellidoPaterno: this.athleteForm.value.apellidoPaterno,
        apellidoMaterno: this.athleteForm.value.apellidoMaterno,
        fechaDeNacimiento: this.athleteForm.value.fechaNacimiento,
        sexo: this.athleteForm.value.sexo.toUpperCase(),
        correo: this.athleteForm.value.correo,
        contrasena: this.athleteForm.value.contrasena || null, 
        peso: parseFloat(this.athleteForm.value.peso),
        estatura: parseFloat(this.athleteForm.value.estatura),
      };
      console.log(atleta);

      if (this.isEditMode && this.atletaId) {
        this.http.put(`${this.apiUrl}/${this.atletaId}`, atleta).subscribe({
          next: () => {
            alert('Atleta actualizado con éxito');
            this.router.navigate(['/admin-dashboard']);
          },
          error: (err) => {
            console.error('Error al actualizar atleta:', err);
            alert('Ocurrió un error al actualizar el atleta. Revisa los datos ingresados.');
          },
        });
      } else {
        this.http.post(this.apiUrl, atleta).subscribe({
          next: () => {
            alert('Atleta registrado con éxito');
            this.router.navigate(['/login']);
          },
          error: (err) => {
            console.error('Error al registrar atleta:', err);
            alert('Ocurrió un error al registrar el atleta. Revisa los datos ingresados.');
          },
        });
      }
    } else {
      alert('Por favor, completa todos los campos correctamente.');
    }
  }

  onCancel(): void {
    this.location.back(); // Navigate to the previous page
  }
}