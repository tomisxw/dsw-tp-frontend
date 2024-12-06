import { Component, inject, OnInit } from '@angular/core';
import { Provincia } from '../../models/provincia.models';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-provincia',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './provincia.component.html',
  styleUrls: ['./provincia.component.css']
})
export class ProvinciaComponent{

  provincia: Provincia | null = null;
  provinciaList: Provincia[] = [];
  private _apiService = inject(ApiService);
  private _fb = inject(FormBuilder);

  url: string = 'http://localhost:3000/api/provincia';
  public view: string = 'default';
  id: string = '';
  provinciaForm!: FormGroup;
  modificar: boolean = false;


  modificarProvincia(mod: boolean): void {
    this.modificar = mod;
  }

  setView(viewName: string): void {
    this.view = viewName;
    if (this.view !== 'buscar') {
      this.id = '';
      this.provincia = null;
    }
  }

  getAllProvincias(): void {
    this._apiService.getAll<Provincia>(this.url).subscribe((data: Provincia[]) => {
      this.provinciaList = data;
    });
  }

  getOneProvincia(): void {
    if (this.id) {
      this._apiService.getOne<Provincia>(this.url, this.id).subscribe({
        next: (data: Provincia) => {
          this.provincia = data;
          console.log('Provincia encontrada', data);
        },
        error: (error) => {
          console.error('Error al obtener la provincia', error);
          alert('Hubo un error al obtener la provincia');
        }
      });
    } else {
      alert('Faltan datos para buscar la provincia');
    }
  }

  initForm(): void {
    this.provinciaForm = this._fb.group({
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]{3,100}$/)]]
    });
  }

  submit(): void {
    if (this.provinciaForm.valid) {
      const provincia: Provincia = this.provinciaForm.value;
      this._apiService.add<Provincia>(this.url, provincia).subscribe(
        (response) => {
          console.log('Provincia creada con éxito', response);
          alert('Provincia cargada con éxito');
          this.getAllProvincias();
        },
        (error) => {
          console.error('Error al crear la provincia', error);
          alert('Hubo un error al crear la provincia');
        }
      );
    } else {
      console.log('Formulario no válido');
      alert('Formulario no válido');
    }
  }

  updateProvincia(): void {
    if (this.provincia && this.provincia.id_provincia) {
      this._apiService.update<Provincia>(this.url, this.provincia.id_provincia.toString(), this.provinciaForm.value).subscribe({
        next: (response: Provincia) => {
          console.log('Provincia actualizada:', response);
          alert('Provincia actualizada correctamente');
          this.getAllProvincias();
        },
        error: (error) => {
          console.error('Error al actualizar la provincia', error);
          alert('Hubo un error al actualizar la provincia');
        }
      });
    }
  }

  populateForm(): void {
    if (this.provincia) {
      this.provinciaForm.patchValue({
        nombre: this.provincia.nombre
      });
    }
  }

  deleteProvincia(): void {
    if (confirm('¿Está seguro que desea eliminar esta provincia?')) {
      this._apiService.delete<Provincia>(this.url, this.id).subscribe({
        next: () => {
          console.log(`Provincia con ID ${this.id} eliminada`);
          alert('Provincia eliminada con éxito');
          this.getAllProvincias();
          this.provincia = null;
          this.id = '';
        },
        error: (error) => {
          console.error('Error al eliminar la provincia:', error);
          alert('Hubo un error al eliminar la provincia');
        }
      });
    }
  }
}
