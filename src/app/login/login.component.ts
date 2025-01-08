import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    this.loginService = "http://localhost:8080/api/login"
    this.loginObject = {
      "correo": "akari@suzumail.com",
      "contrasena": "amoasuzu"
    };
  }

  onLogin() {
    if (this.loginForm.valid) {
      const loginPayload = {
        correo: this.loginForm.value.email,
        contrasena: this.loginForm.value.password,
      };
  
      this.http.post<UserDTO>(this.loginService, loginPayload, { withCredentials: true }).subscribe({
        next: (response) => {
          console.log('Respuesta del backend:', response);
  
          // Guardar información del usuario en localStorage o manejarla en el estado
          localStorage.setItem('activeUser', JSON.stringify(response));
          
          // Redireccionar según el rol
          if (response.rol === 'Administrador') {
            this.router.navigate(['/admin-dashboard']);
          } else if (response.rol === 'Atleta') {
            this.router.navigate(['/athlete-dashboard']);
          }
        },
        error: (err) => {
          this.failedAttempts++;
          console.error('Error en el backend:', err);
  
          if (this.failedAttempts >= this.maxAttempts) {
            this.showAdminContact = true;
          }
        },
      });
    }
  }  
}