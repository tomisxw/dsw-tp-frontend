import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private baseUrl: string = 'http://localhost:3000/api/localidad';

  private _http = inject(HttpClient); 

  getCoordenadas(idLocalidad: string): Observable<{ longitud: number; latitud: number }> {
    return this._http.get<{ longitud: number; latitud: number }>(`${this.baseUrl}/${idLocalidad}/coordenadas`);
  }
}
