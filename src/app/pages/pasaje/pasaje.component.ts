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
  precioMax: string ='';
  pasajesFiltrados: Pasaje[]=[];
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
        this._apiService.getOne<Pasaje>(this.url, compositeKey).subscribe({
            next: (data: Pasaje) => {
                this.pasaje = data;
                console.log('Pasaje encontrado:', data);
            },
            error: (error) => {
                console.error('Error al obtener el pasaje', error);
                alert('Hubo un error al obtener el pasaje');
            },
            complete: () => {
                console.log('Búsqueda completada');
            }
        });
    } else {
        alert('Faltan datos para buscar el pasaje');
    }
}

  getPasajesByPrecio(): void {
    if (!this.precioMax) {
      alert('Por favor, ingresa un Precio Maximo.');
      return; 
    }
      const precM = parseInt(this.precioMax,10)
      if (isNaN(precM)) {
        alert('El ID de aeropuerto debe ser un número.');
        return;
      }

      this._apiService.getPasajeByPrecio(precM).subscribe({
        next: (pasajes: Pasaje[]) => {
          this.pasajesFiltrados = pasajes;
          console.log('Pasajes disponibles:', pasajes);
        },
        error: (error) => {
          console.error('Error al obtener pasajes filtrados:', error);
          alert('No se encontraron pasajes con ese precio máximo.');
        },
      });
  }
  initForm(): void {
    this.pasajeForm = this._fb.group({
      id_pasaje: ['', [Validators.required, Validators.pattern(/^[0-9]{1,3}$/)]],
      fecha_emision: ['', Validators.required],
      precio: ['', Validators.required],
      asiento: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{4}$/)]],
      clase: ['', [Validators.required, Validators.pattern(/^(Primera clase|Clase Ejecutiva|Clase Turista)$/i)]],
      id_vuelo: ['', [Validators.required, Validators.pattern(/^[0-9]{1,3}$/)]],
      id_usuario: ['', [Validators.required, Validators.pattern(/^[0-9]{1,3}$/)]]
    });
  }

  submit(): void {
    if (this.pasajeForm.valid) {
      const pasaje: Pasaje = this.pasajeForm.value;
      this._apiService.add<Pasaje>(this.url, pasaje).subscribe({
        next: (response) =>{
          console.log('Pasaje creado con exito!', response)
          alert('Pasaje cargado con exito!');
        },
        error: (error) => {
          console.error('Error al cargar el Pasaje', error);
          if (error.status === 400 && error.error?.message) {
            alert(`Error: ${error.error.message}`); 
          } else {
            alert('Error inesperado al cargar el Pasaje.');
          }
        },
    });
    } else {
      console.log('Formulario no válido');
      alert('Error al crear el pasaje')
    }
  }

  updatePasaje(): void {
    if(this.pasajeForm.valid){
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
    }} else {
      console.log('Formulario no válido');
      alert('Error al actualizar el vuelo: el formulario contiene datos inválidos');
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
