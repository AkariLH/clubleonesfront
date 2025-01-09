import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdministracionService } from '../services/administracion.service';
import { SessionService } from '../services/session.service';
import { Session } from '../classes/Session';
import { Router } from '@angular/router';

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
    { id: 1, name: 'ADMIN' },
    { id: 2, name: 'ENTRENADOR' },
  ];
  private sessionActive: Session;

  constructor(private fb: FormBuilder, private administracionService: AdministracionService,private session: SessionService, private router: Router) {
    this.userForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      rol: [null, Validators.required],
    });
    this.sessionActive = this.session.getSession();
    if(this.sessionActive.tipoUsuario == 'ADMIN'){
      console.log('administrador');
    }else if(this.session.sessionActive.tipoUsuario == 'ENTRENADOR'){
      this.router.navigate(['/**']);
      console.log('entrenador');
    }else{
      this.router.navigate(['/**']);
      console.log('atleta');
    }
  }

  onSubmit() {
    if (this.userForm.valid) {
      const usuario = {
        nombre: this.userForm.value.nombre,
        correo: this.userForm.value.email,
        contrasena: this.userForm.value.contrasena,
        rol: this.userForm.value.rol, 
      };
  
      console.log('Datos del usuario a enviar:', usuario);
  
      this.administracionService.createAdministrador(usuario).subscribe({
        next: (response) => {
          console.log('Administrador registrado:', response);
          alert('Administrador registrado con éxito');
          this.userForm.reset();
          this.router.navigate(['/admin-dashboard']);
        },
        error: (err) => {
          console.error('Error al registrar administrador:', err);
          alert('Ocurrió un error al registrar el administrador.');
        },
      });
    } else {
      console.log('Formulario inválido');
      this.userForm.markAllAsTouched();
    }
  }  
}