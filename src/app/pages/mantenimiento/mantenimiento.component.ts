import { Component, inject } from '@angular/core';
import { ApiService } from '../../services/api.service.js';
import { Mantenimiento } from '../../models/mantenimiento.models.js';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-mantenimiento',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './mantenimiento.component.html',
  styleUrls: ['./mantenimiento.component.css']
})
export class MantenimientoComponent {
  mantenimiento: Mantenimiento | null = null;
  mantenimientoList: Mantenimiento[] = [];
  private _apiService = inject(ApiService);
  private _fb = inject(FormBuilder);

  url: string = 'http://localhost:3000/api/mantenimiento';
  view: string = 'default';
  id_mantenimiento: string = '';
  fecha: string = '';
  id_avion: string = '';
  mantenimientoForm!: FormGroup;
  modificar: boolean = false;

  modificarMantenimiento(mod: boolean) {
    this.modificar = mod;
  }

  setView(viewName: string) {
    this.view = viewName;

    if (this.view !== 'buscar') {
      this.id_mantenimiento = '';
      this.fecha = '';
      this.id_avion = '';
      this.mantenimiento = null;
    }
  }

  getAllMantenimiento(): void {
    this._apiService.getAll<Mantenimiento>(this.url).subscribe((data: Mantenimiento[]) => {
      this.mantenimientoList = data;
    });
  }

  getOneMantenimiento(): void {
    if (this.id_mantenimiento && this.fecha && this.id_avion) {
      const compositeKey = `${this.id_mantenimiento}/${this.fecha}/${this.id_avion}`;
      this._apiService.getOne<Mantenimiento>(this.url, compositeKey).subscribe((data: Mantenimiento) => {
        this.mantenimiento = data;
      });
    }
  }

  initForm(): void {
    this.mantenimientoForm = this._fb.group({
      id_mantenimiento: ['', Validators.required],
      fecha: ['', Validators.required],
      id_avion: ['', Validators.required],
      descripcion: ['', Validators.required],
      tipo: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.mantenimientoForm.valid) {
      const mantenimiento: Mantenimiento = this.mantenimientoForm.value;
      this._apiService.add<Mantenimiento>(this.url, mantenimiento).subscribe((response) => {
        console.log('Mantenimiento creado con éxito', response);
      });
    } else {
      console.log('Formulario no válido');
    }
  }

  updateMantenimiento(): void {
    if (this.mantenimiento && this.mantenimiento.id_mantenimiento && this.mantenimiento.fecha && this.mantenimiento.id_avion) {
      const compositeKey = `${this.mantenimiento.id_mantenimiento}/${this.mantenimiento.fecha}/${this.mantenimiento.id_avion}`;
      this._apiService.update<Mantenimiento>(this.url, compositeKey, this.mantenimientoForm.value).subscribe({
        next: (response: Mantenimiento) => {
          console.log('Mantenimiento actualizado:', response);
          alert('Mantenimiento actualizado correctamente');
        },
        error: (error) => {
          console.error('Error al actualizar el mantenimiento', error);
          alert('Hubo un error al actualizar el mantenimiento');
        },
        complete: () => {
          console.log('Actualización completada');
        }
      });
    }
  }

  populateForm(): void {
    if (this.mantenimiento) {
      const formattedFecha = new Date(this.mantenimiento.fecha).toISOString().slice(0, 10);
      this.mantenimientoForm.patchValue({
        id_mantenimiento: this.mantenimiento.id_mantenimiento,
        fecha: formattedFecha,
        id_avion: this.mantenimiento.id_avion,
        descripcion: this.mantenimiento.descripcion,
        tipo: this.mantenimiento.tipo
      });
    }
  }

  deleteMantenimiento(): void {
    if (confirm('¿Está seguro que desea eliminar este mantenimiento?')) {
      const compositeKey = `${this.id_mantenimiento}/${this.fecha}/${this.id_avion}`;
      this._apiService.delete<Mantenimiento>(this.url, compositeKey).subscribe({
        next: () => {
          console.log(`Mantenimiento con ID ${compositeKey} eliminado`);
          alert('Mantenimiento eliminado con éxito');
          this.getAllMantenimiento();
          this.mantenimiento = null;
          this.id_mantenimiento = '';
          this.fecha = '';
          this.id_avion = '';
        },
        error: (error) => {
          console.error('Error al eliminar el mantenimiento:', error);
          alert('Hubo un error al eliminar el mantenimiento');
        }
      });
    }
  }
}
