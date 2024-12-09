import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Vuelo } from '../models/vuelo.models.js';
import { Pasaje } from '../models/pasaje.models.js';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private _http = inject(HttpClient);

  // Define la URL base para las solicitudes relacionadas con vuelos
  private baseUrl: string = 'http://localhost:3000/api/vuelo';
  private baseUrl2: string = 'http://localhost:3000/api/pasaje';

  getAll<T>(urlBase: string): Observable<T[]> {
    return this._http.get<T[]>(urlBase);
  }
  
  getOne<T>(urlBase:string, id:string): Observable<T>{
    return this._http.get<T>(`${urlBase}/${id}`)
  }

  add<T>(urlBase:string, entity: T): Observable<T>{
    return this._http.post<T>(urlBase, entity)
  }

  update<T>(urlBase:string ,id:string, entity: T): Observable<T>{
    return this._http.put<T>(`${urlBase}/${id}`, entity)
  }

  delete<T>(urlBase:String, id:string): Observable<T>{
    return this._http.delete<T>(`${urlBase}/${id}`)
  }

  // Método para obtener vuelos filtrados por destino
  getVuelosByDestino(idDestino: number): Observable<Vuelo[]> {
    return this._http.get<Vuelo[]>(`${this.baseUrl}/destino/${idDestino}`);
  }

  getPasajeByPrecio(precio: number): Observable<Pasaje[]> {
    return this._http.get<Pasaje[]>(`${this.baseUrl2}/filtroprecio/${precio}`);
  }
}
