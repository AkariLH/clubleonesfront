import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
})
export class LoginComponent {
  loginForm: FormGroup;
  failedAttempts: number = 0;
  maxAttempts: number = 3;
  showAdminContact: boolean = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      // Simula una autenticación fallida
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;

      // Reemplaza este bloque con tu lógica de autenticación real
      if (email !== 'admin@example.com' || password !== 'admin123') {
        this.failedAttempts++;
        if (this.failedAttempts >= this.maxAttempts) {
          this.showAdminContact = true;
        }
        console.log('Intento fallido:', this.failedAttempts);
        alert('Credenciales incorrectas');
      } else {
        this.failedAttempts = 0;
        alert('Inicio de sesión exitoso');
        // Aquí redirige al usuario a otra página
        this.router.navigate(['/admin-dashboard']);
      }
    }
  }
}