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
      this._apiService.getOne<Aeropuerto>(this.url, this.id).subscribe(
        (data:Aeropuerto) =>
          this.aeropuerto = data
      )
    }
  }

  initForm(): void {
    this.aeropuertoForm = this._fb.group({
      name: ['', Validators.required],
      capacidad_aviones: ['', [Validators.required]],
      numero_terminales: ['', Validators.required],
    });
  }

  submit():void {
    console.log('Por aca tmb entra')
    if(this.aeropuertoForm.valid){
      const aeropuerto: Aeropuerto = this.aeropuertoForm.value;
      this._apiService.add<Aeropuerto>(this.url, aeropuerto).subscribe(
        (response) =>{
          console.log('Aeropuerto creado con exito', response)
        }
      )
    }else {
      console.log('Formulario no valido')}
  }

  updateAeropuerto():void{
    if(this.aeropuerto && this.aeropuerto.id_aeropuerto){
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
        name: this.aeropuerto.name,
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
        },
        error: (error) => {
          console.error('Error al eliminar el Aeropuerto:', error);
          alert('Hubo un error al eliminar el Aeropuerto');
        }
      });
    }
  }


  
}
