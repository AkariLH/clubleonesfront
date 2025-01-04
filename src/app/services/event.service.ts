import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiUrl = 'http://localhost:8080/api/eventos'; // URL base del backend

  constructor(private http: HttpClient) {}

  // Obtener todos los eventos
  getAllEventos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Obtener un evento por ID
  getEventoById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo evento
  createEvento(evento: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, evento);
  }

  // Actualizar un evento existente
  updateEvento(id: number, evento: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, evento);
  }

  // Eliminar un evento
  deleteEvento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
