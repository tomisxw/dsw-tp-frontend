import { Component, inject, OnInit } from '@angular/core';
import { Aeropuerto } from '../../models/aeropuerto.models.js';
import { ApiService } from '../../services/api.service.js';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-aeropuerto',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './aeropuerto.component.html',
  styleUrl: './aeropuerto.component.css'
})
export class AeropuertoComponent{

  aeropuerto:Aeropuerto | null = null;
  aeropuertoList: Aeropuerto[] = [] ;
  private _apiService = inject(ApiService);
  private _fb = inject(FormBuilder);

  url:string = 'http://localhost:3000/api/aeropuerto' ;
  public view:string = 'default';
  id:string = '';
  aeropuertoForm! : FormGroup ;
  modificar: boolean = false ;

  modificarAeropuerto(mod:boolean){
    this.modificar = mod
  };


  setView(viewName:string){
    this.view = viewName
    if (this.view != 'buscar') {
      this.id = '';  
      this.aeropuerto = null
    }
  };

  getAllAeropuerto(): void {
    this._apiService.getAll<Aeropuerto>(this.url).subscribe((data: Aeropuerto[]) =>{
      this.aeropuertoList = data
    })
  }

  getOneAeropuerto():void{
    if(this.id){
      this._apiService.getOne<Aeropuerto>(this.url, this.id).subscribe({
        next: (data: Aeropuerto) =>{
        this.aeropuerto = data
        console.log('Avion encontrado', data)
      },
      error: (error) => {
        console.error('Error al obtener el aeropuerto', error)
        alert('Hubo un error al obtener el aeropuerto');
      },
      complete: () => {
        console.log('Búsqueda completada')
      }
    })
    } else {
      alert('Faltan datos para buscar el aeropuerto')
    }
  }


  initForm(): void {
    this.aeropuertoForm = this._fb.group({
      nombre: ['', Validators.required],
      capacidad_aviones: ['', [Validators.required]],
      numero_terminales: ['', Validators.required],
    });
  }

  submit():void {
    if(this.aeropuertoForm.valid){
      const aeropuerto: Aeropuerto = this.aeropuertoForm.value;
      this._apiService.add<Aeropuerto>(this.url, aeropuerto).subscribe(
        (response) =>{
          console.log('Aeropuerto creado con exito!', response)
          alert('Aeropuerto cargado con exito!')
        }
      )
    }else {
      console.log('Formulario no valido')}
      alert('Error al cargar el aeropuerto')
  }

  updateAeropuerto():void{
    console.log('entro')
    if(this.aeropuerto && this.aeropuerto.id_aeropuerto){
      console.log('ta creado')
      this._apiService.update<Aeropuerto>(this.url, this.aeropuerto.id_aeropuerto.toString(), this.aeropuertoForm.value).subscribe({
        next: (response: Aeropuerto) => {
          console.log('Aeropuerto actualizado:', response);
          alert('Aeropuerto actualizado correctamente');
        },
        error: (error) => {
          console.error('Error al actualizar el Aeropuerto', error);
          alert('Hubo un error al actualizar el Aeropuerto');
        },
        complete: () => {
          console.log('Actualización completada');
        }
      });
    } 
  }


  populateForm(): void {
    if(this.aeropuerto){
      this.aeropuertoForm.patchValue({
        nombre: this.aeropuerto.nombre,
        capacidad_aviones: this.aeropuerto.capacidad_aviones,
        numero_terminales: this.aeropuerto.numero_terminales,
      })
    }

  }

  deleteAeropuerto(): void {
    if (confirm('¿Está seguro que desea eliminar este Aeropuerto?')) {
      this._apiService.delete<Aeropuerto>(this.url, this.id).subscribe({
        next: () => {
          console.log(`Aeropuerto con ID ${this.id} eliminado`);
          alert('Aeropuerto eliminado con éxito');
          this.getAllAeropuerto(),
          this.aeropuerto = null,
          this.id = ''
        },
        error: (error) => {
          console.error('Error al eliminar el Aeropuerto:', error);
          alert('Hubo un error al eliminar el Aeropuerto');
        }
      });
    }
  }


  
}
