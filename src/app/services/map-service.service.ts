import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private baseUrl: string = 'http://localhost:3000/api/localidad';

  private _http = inject(HttpClient); 

  getCoordenadas(idLocalidad: string): Observable<{ longitud: number; latitud: number }> {
    return this._http.get<{ longitud: number; latitud: number }>(`${this.baseUrl}/${idLocalidad}/coordenadas`).pipe(
      map((response) => {
        // Convertir a números flotantes en caso de que sean cadenas
        const latitud = parseFloat(response.latitud.toString());
        const longitud = parseFloat(response.longitud.toString());
  
        // Verificar que las coordenadas son números válidos
        if (!isNaN(latitud) && !isNaN(longitud)) {
          return { latitud, longitud };
        } else {
          throw new Error('Coordenadas inválidas recibidas');
        }
      })
    );
  }
  
}
