import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

interface Usuario {
  nombre: string;
  correo: string;
  rol: string;
}

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
})

export class UserTableComponent {
  usuarios: Usuario[] = [
    { nombre: 'Carlos Pérez', correo: 'carlos@mail.com', rol: 'Administrador' },
    { nombre: 'Ana Martínez', correo: 'ana@mail.com', rol: 'Entrenador' },
    { nombre: 'Pedro Gómez', correo: 'pedro@mail.com', rol: 'Atleta' },
  ];

  searchTerm: string = '';
  selectedRole: string = '';
  dropdownVisible: boolean = false;
  faFilter = faFilter;
  
  get filteredUsuarios(): Usuario[] {
    if (!this.selectedRole || this.selectedRole === '') {
      return this.usuarios; // Mostrar todos si no hay filtro
    }
    return this.usuarios.filter(user => user.rol === this.selectedRole);
  }

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  aplicarFiltros() {
    console.log('Filtros aplicados:', {
      searchTerm: this.searchTerm,
      selectedRole: this.selectedRole,
    });
    this.dropdownVisible = false;
  }

  clearFilters() {
    this.selectedRole = ''; // Solo limpia el filtro
  }
}
