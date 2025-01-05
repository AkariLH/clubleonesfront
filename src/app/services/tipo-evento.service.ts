import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TipoEventoService {
  private apiUrl = 'http://localhost:8080/api/tipoeventos'; 
  constructor(private http: HttpClient) {}

  getTipoEventos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl); // Devuelve la lista de tipos de eventos
  }
  createTipoEvento(tipoEvento: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, tipoEvento);
  }
}
