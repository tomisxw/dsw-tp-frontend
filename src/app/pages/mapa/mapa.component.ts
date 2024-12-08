import { Component, Input, OnChanges } from '@angular/core';
import { GoogleMap, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [GoogleMap, MapMarker],
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css'], // Corregido: styleUrls en plural
})
export class MapaComponent implements OnChanges {
  @Input() coordenadas: { latitud: number; longitud: number } | null = null;

  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  zoom = 10;

  ngOnChanges(): void {
    if (this.coordenadas) {
      this.center = {
        lat: this.coordenadas.latitud,
        lng: this.coordenadas.longitud,
      };
    }
  }
}
