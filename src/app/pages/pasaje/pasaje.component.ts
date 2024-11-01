import { Component, inject } from '@angular/core';
import { ApiService } from '../../services/api.service.js';
import { Pasaje } from '../../models/pasaje.models.js';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-pasaje',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './pasaje.component.html',
  styleUrl: './pasaje.component.css'
})
export class PasajeComponent {

  pasaje: Pasaje | null = null;
  pasajeList: Pasaje[] = [];
  private _apiService = inject(ApiService);
  private _fb = inject(FormBuilder);

  url: string = 'http://localhost:3000/api/pasaje';
  view: string = 'default';
  id_pasaje: string = '';
  fecha_emision: string = '';
  id_vuelo:string = '';
  id_usuario:string = '';
  pasajeForm!: FormGroup;
  modificar: boolean = false;

  modificarPasaje(mod: boolean) {
    this.modificar = mod;
  }

  setView(viewName: string) {
    this.view = viewName;
    if (this.view !== 'buscar') {
      this.id_pasaje = '';
      this.fecha_emision = '';
      this.id_vuelo = '';
      this.id_usuario = '';
      this.pasaje = null;
    }
  }

  getAllPasaje(): void {
    this._apiService.getAll<Pasaje>(this.url).subscribe((data: Pasaje[]) => {
      this.pasajeList = data;
    });
  }

  getOnePasaje(): void {
    if (this.id_pasaje && this.fecha_emision && this.id_vuelo && this.id_usuario) {
      const compositeKey = `${this.id_vuelo}/${this.fecha_emision}/${this.id_pasaje}/${this.id_usuario}`; 
      this._apiService.getOne<Pasaje>(this.url, compositeKey).subscribe(
        (data: Pasaje) => {
          this.pasaje = data;
        }
      );
    }
  }

  initForm(): void {
    this.pasajeForm = this._fb.group({
      id_pasaje: ['', Validators.required],
      fecha_emision: ['', Validators.required],
      precio: ['', Validators.required],
      asiento: ['', Validators.required],
      clase: ['', Validators.required],
      id_vuelo: ['', Validators.required],
      id_usuario: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.pasajeForm.valid) {
      const pasaje: Pasaje = this.pasajeForm.value;
      this._apiService.add<Pasaje>(this.url, pasaje).subscribe(
        (response) => {
          console.log('Pasaje creado con éxito', response);
        }
      );
    } else {
      console.log('Formulario no válido');
    }
  }

  updatePasaje(): void {
    if (this.pasaje && this.pasaje.id_pasaje && this.pasaje.fecha_emision && this.pasaje.id_usuario && this.pasaje.id_vuelo) {
      const compositeKey = `${this.pasaje.id_vuelo}/${this.pasaje.fecha_emision}/${this.pasaje.id_pasaje}/${this.pasaje.id_usuario}`;
      this._apiService.update<Pasaje>(this.url, compositeKey, this.pasajeForm.value).subscribe({
        next: (response: Pasaje) => {
          console.log('Pasaje actualizado:', response);
          alert('Pasaje actualizado correctamente');
        },
        error: (error) => {
          console.error('Error al actualizar el pasaje', error);
          alert('Hubo un error al actualizar el pasaje');
        },
        complete: () => {
          console.log('Actualización completada');
        }
      });
    }
  }

  populateForm(): void {
    if (this.pasaje) {
      const formattedFechaEmision = new Date(this.pasaje.fecha_emision).toISOString().slice(0, 16);
      this.pasajeForm.patchValue({
        id_pasaje: this.pasaje.id_pasaje,
        fecha_emision: formattedFechaEmision,
        precio: this.pasaje.precio,
        asiento: this.pasaje.asiento,
        clase: this.pasaje.clase,
        id_vuelo: this.pasaje.id_vuelo,
        id_usuario: this.pasaje.id_usuario
      });
    }
  }

  deletePasaje(): void {
    if (confirm('¿Está seguro que desea eliminar este pasaje?')) {
      const compositeKey = `${this.id_vuelo}/${this.fecha_emision}/${this.id_pasaje}/${this.id_usuario}`; 
      this._apiService.delete<Pasaje>(this.url, compositeKey).subscribe({
        next: () => {
          console.log(`Pasaje con ID ${compositeKey} eliminado`);
          alert('Pasaje eliminado con éxito');
          this.getAllPasaje();
          this.pasaje = null;
          this.id_pasaje = '';
          this.fecha_emision = '';
          this.id_vuelo ='';
          this.id_usuario = '';
        },
        error: (error) => {
          console.error('Error al eliminar el pasaje:', error);
          alert('Hubo un error al eliminar el pasaje');
        }
      });
    }
  }
}
