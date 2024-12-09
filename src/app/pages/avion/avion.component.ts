import { Component, inject, OnInit } from '@angular/core';
import { Avion } from '../../models/avion.models.js';
import { ApiService } from '../../services/api.service.js';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-avion',
  standalone: true,
  imports: [CommonModule,FormsModule, ReactiveFormsModule],
  templateUrl: './avion.component.html',
  styleUrl: './avion.component.css'
})
export class AvionComponent {

  avion:Avion | null = null;
  avionList: Avion[] = [];
  private _apiService = inject(ApiService)
  private _fb = inject(FormBuilder)

  url:string = 'http://localhost:3000/api/avion';
  public view:string = 'default' ;
  id:string = '';
  avionForm!: FormGroup;
  modificar:boolean = false ; 

  modificarAvion(mod:boolean){
    this.modificar = mod
  };

  setView(viewName:string){
    this.view = viewName;
    if (this.view != 'buscar') {
      this.id = '';  
      this.avion = null
    }
  };

  getAllAviones(): void {
    this._apiService.getAll<Avion>(this.url).subscribe((data: Avion[]) =>{
      this.avionList = data
    })    
  }

  getOneAvion():void{
    if(this.id){
      this._apiService.getOne<Avion>(this.url,this.id).subscribe({
        next: (data: Avion) =>{
          this.avion = data
          console.log('Avion encontrado', data)
        },
        error: (error) => {
          console.error('Error al obtener el avion', error)
          alert('Hubo un error al obtener el avion');
        },
        complete: () => {
            console.log('Búsqueda completada');
        }
        });
      } else {
          alert('Faltan datos para buscar el avion');
      }
  }



  initForm(): void {
    this.avionForm = this._fb.group({
      modelo: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s]{3,60}$/)]],
      capacidad_pasajeros: [null, [Validators.required,Validators.pattern(/^[0-9]$/)]],
      fabricante: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s]{3,60}$/)]],
      anio_fabricacion: [null, [Validators.required,Validators.pattern(/^[0-9]{4}$/), Validators.max(2024),Validators.min(1950)]],  
      capacidad_kg: [null, [Validators.required,Validators.pattern(/^[0-9]{1,15}$/)]],
    });
    }


  submit(): void {
    if (this.avionForm.valid) {  // Cambiado a avionForm
      const avion: Avion = this.avionForm.value;  // Cambiado a avion
      this._apiService.add<Avion>(this.url, avion).subscribe(
        (response) => {
          console.log('Avion creado con éxito', response);
          alert('Avion cargado con exito!')
        }
      );
    } else {
      console.log('Formulario no válido');
      alert('Error al cargar el avion')
    }
  }

updateAvion():void {
  if(this.avionForm.valid){
  if(this.avion && this.avion.id_avion){
    this._apiService.update<Avion>(this.url, this.avion.id_avion.toString(), this.avionForm.value).subscribe({
      next: (response: Avion) => {
        console.log('Avion actualizado:', response);
        alert('Avion actualizado correctamente');
      },
      error: (error) => {
        console.error('Error al actualizar el Avion', error);
        alert('Hubo un error al actualizar el Avion');
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
  if (this.avion) {
    
    this.avionForm.patchValue({
      modelo: this.avion.modelo,
      capacidad_pasajeros: this.avion.capacidad_pasajeros,
      fabricante: this.avion.fabricante,
      anio_fabricacion: this.avion.anio_fabricacion,
      capacidad_kg: this.avion.capacidad_kg
    });
  }
}


deleteAvion(): void {
  if (confirm('¿Está seguro que desea eliminar este Avion?')) {
    this._apiService.delete<Avion>(this.url, this.id).subscribe({
      next: () => {
        console.log(`Avion con ID ${this.id} eliminado`);
        alert('Avion eliminado con éxito');
        this.getAllAviones();
        this.avion = null,
        this.id = ''
      },
      error: (error) => {
        console.error('Error al eliminar el Avion:', error);
        alert('Hubo un error al eliminar el Avion');
      }
    });
  }
}

}





