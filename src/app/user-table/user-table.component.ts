import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { HttpClient } from '@angular/common/http';
import { HostListener } from '@angular/core';
import { Router } from '@angular/router';


interface Usuario {
  id: number;
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
export class UserTableComponent implements OnInit {
  usuarios: Usuario[] = [];
  searchTerm: string = '';
  selectedRole: string = '';
  dropdownVisible: boolean = false;
  faFilter = faFilter;

  private atletasApiUrl = 'http://localhost:8080/api/atletas'; // URL para atletas
  private administradoresApiUrl = 'http://localhost:8080/api/administradores'; // URL para administradores

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    const atletas$ = this.http.get<any[]>(this.atletasApiUrl); // Cambiamos el tipo a 'any[]' para manejar las propiedades reales
    const administradores$ = this.http.get<any[]>(this.administradoresApiUrl);
  
    // Combina las respuestas de ambos endpoints
    atletas$.subscribe(
      (atletas) => {
        const atletasMapped = atletas.map((atleta) => ({
          id: atleta.id || atleta.idAtleta, // Ajustar según el campo real del ID
          nombre: `${atleta.nombre} ${atleta.apellidoPaterno || ''} ${atleta.apellidoMaterno || ''}`.trim(),
          correo: atleta.correo,
          rol: 'Atleta',
        }));
        administradores$.subscribe(
          (administradores) => {
            const administradoresMapped = administradores.map((admin) => ({
              id: admin.id || admin.idAdministrador, // Asegúrate de usar el campo correcto para el ID
              nombre: admin.nombre,
              correo: admin.correo,
              rol: admin.rol || 'ADMIN', // Rol por defecto si no existe
            }));
            this.usuarios = [...atletasMapped, ...administradoresMapped];
            console.log('Usuarios cargados:', this.usuarios);
          },
          (error) => console.error('Error al cargar administradores:', error)
        );
      },
      (error) => console.error('Error al cargar atletas:', error)
    );
  }
  

  get filteredUsuarios(): Usuario[] {
    const searchLower = this.searchTerm.toLowerCase();
  
    return this.usuarios.filter((usuario) => {
      const matchesRole = this.selectedRole ? usuario.rol.toLowerCase() === this.selectedRole.toLowerCase() : true;
      const matchesSearchTerm = usuario.nombre.toLowerCase().includes(searchLower) || usuario.correo.toLowerCase().includes(searchLower);
  
      return matchesRole && matchesSearchTerm;
    });
  }  

  toggleDropdown(): void {
    this.dropdownVisible = !this.dropdownVisible;
  }

  aplicarFiltros(): void {
    console.log('Filtros aplicados:', {
      searchTerm: this.searchTerm,
      selectedRole: this.selectedRole,
    });
    this.dropdownVisible = false;
  }

  clearFilters(): void {
    this.selectedRole = '';
    this.searchTerm = '';
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    // Verifica si el clic fue fuera del dropdown
    if (
      !target.closest('.filter-dropdown-container') &&
      this.dropdownVisible
    ) {
      this.dropdownVisible = false;
    }
  }

    editarUsuario(usuario: Usuario): void {
      if (usuario.rol === 'Atleta') {
        this.router.navigate(['/registro-atletas', usuario.id]);
      } else if (usuario.rol === 'ADMIN' || usuario.rol === 'ENTRENADOR') {
        this.router.navigate(['/registro-admin', usuario.id]);
      }
    }
  
    eliminarUsuario(usuario: Usuario): void {
      const confirmacion = confirm(`¿Estás seguro de que deseas eliminar a ${usuario.nombre}?`);
      if (confirmacion) {
        const apiUrl = usuario.rol === 'Atleta' 
          ? `http://localhost:8080/api/atletas/${usuario.id}`
          : `http://localhost:8080/api/administradores/${usuario.id}`;
  
        this.http.delete(apiUrl).subscribe({
          next: () => {
            alert(`${usuario.nombre} ha sido eliminado correctamente.`);
            this.cargarUsuarios();
          },
          error: (err) => {
            console.error('Error al eliminar usuario:', err);
            alert('Ocurrió un error al eliminar el usuario.');
          },
        });
      }
    }
}