import { Component, inject, OnInit } from '@angular/core';
import { Avion } from '../../models/avion.models.js';
import { ApiService } from '../../services/api.service.js';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, FormGroup, ReactiveFormsModule, Validator, Validators } from '@angular/forms';

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
      this._apiService.getOne<Avion>(this.url,this.id).subscribe(
        (data: Avion) =>{
          this.avion = data

        }
      )
    }
  }

  initForm(): void {
    this.avionForm = this._fb.group({
      modelo: ['', Validators.required],
      capacidad_pasajeros: [null, Validators.required], // Asegúrate de que el valor predeterminado sea correcto
      fabricante: ['', Validators.required],
      anio_fabricacion: [null, Validators.required],  // Podrías poner una fecha por defecto
      capacidad_kg: [null, Validators.required],
    });
    }




  submit(): void {
    if (this.avionForm.valid) {  // Cambiado a avionForm
      const avion: Avion = this.avionForm.value;  // Cambiado a avion
      this._apiService.add<Avion>(this.url, avion).subscribe(
        (response) => {
          console.log('Avion creado con éxito', response);
        }
      );
    } else {
      console.log('Formulario no válido');
    }
  }

updateAvion():void {
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
  }
}
populateForm(): void {
  if (this.avion) {
    let anioFabricacion = this.avion.anio_fabricacion;

    // Verificar si es cadena y convertir a Date si es necesario
    if (typeof anioFabricacion === 'string') {
      anioFabricacion = new Date(anioFabricacion);
    }

    const formattedDate = anioFabricacion.toISOString().slice(0, 10);  // Solo YYYY-MM-DD
    console.log(formattedDate);  // Para verificar

    this.avionForm.patchValue({
      modelo: this.avion.modelo,
      capacidad_pasajeros: this.avion.capacidad_pasajeros,
      fabricante: this.avion.fabricante,
      anio_fabricacion: formattedDate,
      capacidad_kg: this.avion.capacidad_kg
    });

    // Verificar el valor y el tipo de anio_fabricacion
    console.log(this.avion.anio_fabricacion);  
    console.log(typeof this.avion.anio_fabricacion);  // ¿Es string o Date?
  }
}


deleteAvion(): void {
  if (confirm('¿Está seguro que desea eliminar este Avion?')) {
    this._apiService.delete<Avion>(this.url, this.id).subscribe({
      next: () => {
        console.log(`Avion con ID ${this.id} eliminado`);
        alert('Avion eliminado con éxito');
        this.getAllAviones();
      },
      error: (error) => {
        console.error('Error al eliminar el Avion:', error);
        alert('Hubo un error al eliminar el Avion');
      }
    });
  }
}

}





