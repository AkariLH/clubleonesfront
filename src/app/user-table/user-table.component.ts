import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css'],
  standalone: true,
  imports:[CommonModule],
})
export class UserTableComponent {
  usuarios = [
    { nombre: 'Carlos Pérez', correo: 'carlos@mail.com', rol: 'Administrador' },
    { nombre: 'Ana Martínez', correo: 'ana@mail.com', rol: 'Entrenador' },
  ];
}
