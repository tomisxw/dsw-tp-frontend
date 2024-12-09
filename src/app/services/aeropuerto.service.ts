import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Aeropuerto } from '../models/aeropuerto.models';

@Injectable({
    providedIn: 'root'
})
export class AeropuertoService {
    private apiUrl = 'http://localhost:3000/api/aeropuerto';

    constructor(private http: HttpClient) {}

    obtenerAeropuertos(): Observable<Aeropuerto[]> {
        return this.http.get<Aeropuerto[]>(this.apiUrl);
    }

    obtenerAeropuertoPorId(id: number): Observable<Aeropuerto> {
        return this.http.get<Aeropuerto>(`${this.apiUrl}/${id}`);
    }
}
