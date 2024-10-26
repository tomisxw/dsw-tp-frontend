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

  add<T>(urlBase:string, entity: T): Observable<T>{
    return this._http.post<T>(urlBase, entity)
  }

  update<T>(urlBase:string ,id:string, entity: T): Observable<T>{
    return this._http.put<T>(`${urlBase}/${id}`, entity)
  }

  delete<T>(urlBase:String, id:string): Observable<T>{
    return this._http.delete<T>(`${urlBase}/${id}`)
  }


}
