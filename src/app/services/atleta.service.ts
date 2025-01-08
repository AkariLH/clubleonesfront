import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Hace que este servicio esté disponible en toda la aplicación
})
export class AtletaService {
  private apiUrl = 'http://localhost:8080/api/atletas'; // URL base del backend

  constructor(private http: HttpClient) {}

  // Método para obtener la lista de atletas
  getAtletas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Método para registrar un atleta a un evento
  registerToEvent(atletaId: number, eventoId: number): Observable<any> {
    const url = `${this.apiUrl}/${atletaId}/eventos/${eventoId}`;
    return this.http.post<any>(url, {});
  }
}
