import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root', // Esto asegura que el servicio sea inyectable en toda la aplicación
})
export class ApiService {
  constructor(private http: HttpClient) {}
}
