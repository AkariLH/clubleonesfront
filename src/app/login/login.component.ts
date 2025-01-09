import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SessionService } from '../services/session.service';
import { Session } from '../classes/Session';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,HttpClientModule],
})
export class LoginComponent {
  loginForm: FormGroup;
  failedAttempts: number = 0;
  maxAttempts: number = 3;
  showAdminContact: boolean = false;

  loginService: string;
  loginObject: any;

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient, private session: SessionService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    this.loginService = "http://localhost:8080/api/login"
    this.loginObject = {
      "correo": "akari@suzumail.com",
      "contrasena": "amoasuzu"
    };
    this.session.printCookie();
  }

  onLogin() {
    if (this.loginForm.valid) {
      const loginPayload = {
        correo: this.loginForm.value.email,
        contrasena: this.loginForm.value.password,
      };
  
      // Inspeccionar el payload enviado
      console.log('Datos enviados al backend:', loginPayload);
  
      this.http.post(this.loginService, loginPayload).subscribe({
        next: (response) => {
          console.log('Respuesta del backend:', response);
          this.session.sessionActive = JSON.parse(JSON.stringify(response));
          this.session.saveSession(this.session.sessionActive);
          if(this.session.sessionActive.tipoUsuario == 'ADMIN'){
            this.router.navigate(['/admin-dashboard']);
            console.log('administrador');
          }else if(this.session.sessionActive.tipoUsuario == 'ENTRENADOR'){
            this.router.navigate(['/coach-dashboard']);
            console.log('entrenador');
          }else{
            // redireccion
            console.log('atleta');
          }
        },
        error: (err) => {
          console.error('Error en el backend:', err);
        },
      });
    }
  }  

  onRegister() {
    this.router.navigate(['/registro-atletas']); // Cambia '/register' a la ruta correspondiente
  }
  
}