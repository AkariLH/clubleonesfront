import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdministracionService } from '../services/administracion.service';
import { SessionService } from '../services/session.service';
import { Session } from '../classes/Session';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-administration-registration',
  templateUrl: './administration-registration.component.html',
  styleUrls: ['./administration-registration.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class AdministrationRegistrationComponent {
  userForm: FormGroup;
  isEditMode = false;
  roles = [
    { id: 1, name: 'ADMIN' },
    { id: 2, name: 'ENTRENADOR' },
  ];
  private sessionActive: Session;
  private adminId: number | null = null;

  constructor(private fb: FormBuilder, private administracionService: AdministracionService,private session: SessionService, private router: Router, private route: ActivatedRoute) {
    this.userForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      rol: [null, Validators.required],
    });
    this.sessionActive = this.session.getSession();
    if(this.sessionActive.tipoUsuario !== 'ADMIN'){
      console.log('Administrador');
      this.router.navigate(['/**']);
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.adminId = +id;
        this.loadAdministrador(+id);
      }
    });
  }
  
  loadAdministrador(id: number): void {
    this.administracionService.getAdministradorById(id).subscribe((administrador) => {
      console.log('Datos recibidos del backend:', administrador); 
      this.userForm.patchValue({
        nombre: administrador.nombre,
        correo: administrador.correo, 
        rol: administrador.rol,
      });
    });
  }
  

  onSubmit() {
    if (this.userForm.valid) {
      const usuario = {
        nombre: this.userForm.value.nombre,
        correo: this.userForm.value.correo,
        contrasena: this.userForm.value.contrasena || null, 
        rol: this.userForm.value.rol,
      };
      //console.log('Datos a enviar al backend:', usuario); //Verificar contenido

      if (this.isEditMode && this.adminId) {
        // Modo edición: PUT
        this.administracionService.updateAdministrador(this.adminId, usuario).subscribe({
          next: (response) => {
            alert('Administrador actualizado con éxito');
            this.router.navigate(['/admin-dashboard']);
          },
          error: (err) => {
            console.error('Error al actualizar administrador:', err);
            alert('Ocurrió un error al actualizar el administrador.');
          },
        });
      } else {
        // Modo registro: POST
        this.administracionService.createAdministrador(usuario).subscribe({
          next: (response) => {
            alert('Administrador registrado con éxito');
            this.userForm.reset();
            this.router.navigate(['/admin-dashboard']);
          },
          error: (err) => {
            console.error('Error al registrar administrador:', err);
            alert('Ocurrió un error al registrar el administrador.');
          },
        });
      }
    } else {
      alert('Por favor, completa todos los campos correctamente.');
      this.userForm.markAllAsTouched();
    }
  }  
}