import { Component, inject, OnInit } from '@angular/core';
import { Localidad } from '../../models/localidad.models';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-localidad',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './localidad.component.html',
  styleUrls: ['./localidad.component.css']
})
export class LocalidadComponent {

  localidad: Localidad | null = null;
  localidadList: Localidad[] = [];
  private _apiService = inject(ApiService);
  private _fb = inject(FormBuilder);

  url: string = 'http://localhost:3000/api/localidad';
  public view: string = 'default';
  id: string = '';
  localidadForm!: FormGroup;
  modificar: boolean = false;

  modificarLocalidad(mod: boolean): void {
    this.modificar = mod;
  }

  setView(viewName: string): void {
    this.view = viewName;
    if (this.view !== 'buscar') {
      this.id = '';
      this.localidad = null;
    }
  }

  getAllLocalidades(): void {
    this._apiService.getAll<Localidad>(this.url).subscribe((data: Localidad[]) => {
      this.localidadList = data;
    });
  }

  getOneLocalidad(): void {
    if (this.id) {
      this._apiService.getOne<Localidad>(this.url, this.id).subscribe({
        next: (data: Localidad) => {
          this.localidad = data;
          console.log('Localidad encontrada', data);
        },
        error: (error) => {
          console.error('Error al obtener la localidad', error);
          alert('Hubo un error al obtener la localidad');
        }
      });
    } else {
      alert('Faltan datos para buscar la localidad');
    }
  }

  initForm(): void {
    this.localidadForm = this._fb.group({
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]{3,100}$/)]],
      latitud: [null, Validators.required],
      longitud: [null, Validators.required],
      id_provincia: [null, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
    });
  }

  submit(): void {
    if (this.localidadForm.valid) {
      const localidad: Localidad = this.localidadForm.value;
      this._apiService.add<Localidad>(this.url, localidad).subscribe(
        (response) => {
          console.log('Localidad creada con éxito', response);
          alert('Localidad cargada con éxito');
          this.getAllLocalidades();
        },
        (error) => {
          console.error('Error al crear la localidad', error);
          alert('Hubo un error al crear la localidad');
        }
      );
    } else {
      console.log('Formulario no válido');
      alert('Formulario no válido');
    }
  }

  updateLocalidad(): void {
    if (this.localidad && this.localidad.id_localidad) {
      this._apiService.update<Localidad>(this.url, this.localidad.id_localidad.toString(), this.localidadForm.value).subscribe({
        next: (response: Localidad) => {
          console.log('Localidad actualizada:', response);
          alert('Localidad actualizada correctamente');
          this.getAllLocalidades();
        },
        error: (error) => {
          console.error('Error al actualizar la localidad', error);
          alert('Hubo un error al actualizar la localidad');
        }
      });
    }
  }

  populateForm(): void {
    if (this.localidad) {
      this.localidadForm.patchValue({
        nombre: this.localidad.nombre,
        latitud: this.localidad.latitud,
        longitud: this.localidad.longitud,
        id_provincia: this.localidad.id_provincia
      });
    }
  }

  deleteLocalidad(): void {
    if (confirm('¿Está seguro que desea eliminar esta localidad?')) {
      this._apiService.delete<Localidad>(this.url, this.id).subscribe({
        next: () => {
          console.log(`Localidad con ID ${this.id} eliminada`);
          alert('Localidad eliminada con éxito');
          this.getAllLocalidades();
          this.localidad = null;
          this.id = '';
        },
        error: (error) => {
          console.error('Error al eliminar la localidad:', error);
          alert('Hubo un error al eliminar la localidad');
        }
      });
    }
  }
}
