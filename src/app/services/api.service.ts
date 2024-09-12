import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.models.js';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private _http = inject(HttpClient);

  getAll<T>(urlBase:string): Observable<T[]>{
    return this._http.get<T[]>(urlBase)
  }
  
  getOne<T>(urlBase:string, id:string): Observable<T>{
    return this._http.get<T>(`${urlBase}/${id}`)
  }
}
