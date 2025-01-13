import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdministracionService {
  private apiUrl = 'http://localhost:8080/api/administradores'; // Cambia la URL según tu configuración

  constructor(private http: HttpClient) {}

  getEntrenadores(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl); // Devuelve la lista de entrenadores
  }

  createAdministrador(administrador: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, administrador);
  }

  getAdministradorById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  updateAdministrador(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }
}
