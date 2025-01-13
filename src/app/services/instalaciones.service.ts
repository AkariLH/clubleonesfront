import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InstalacionService {
  private apiUrl = 'http://localhost:8080/api/instalaciones';

  constructor(private http: HttpClient) {}

  getInstalaciones(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Obtener actividades por instalación
  getActividadesByInstalacion(idInstalacion: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/actividades/${idInstalacion}`);
  }
}
