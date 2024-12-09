import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AeropuertoService } from '../../../services/aeropuerto.service.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-aeropuerto-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './aeropuerto.details.component.html',
  styleUrls: ['./aeropuerto.details.component.css']
})
export class AeropuertoDetailComponent implements OnInit {
  aeropuerto: any;

  constructor(
    private aeropuertoService: AeropuertoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.aeropuertoService.obtenerAeropuertoPorId(id).subscribe(
      (data) => (this.aeropuerto = data),
      (error) => console.error('Error al cargar el aeropuerto', error)
    );
  }

  volverALista(): void {
    this.router.navigate(['/aeropuerto']);
  }
}
