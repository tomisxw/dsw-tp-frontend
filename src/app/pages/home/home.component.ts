import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private router = inject(Router)

  navigateToAeropuertos() {
    this.router.navigate(['/aeropuerto']);
  }

  navigateToQuienesSomos() {
    this.router.navigate(['/quienes-somos']);
  }

  navigateToAtencionCliente() {
    this.router.navigate(['/atencion-cliente']);
  }

  navigateToVuelos() {
    this.router.navigate(['/vuelo']);
  } 
}
