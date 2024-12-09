import { Component, inject } from '@angular/core';
import { Vuelo } from '../../models/vuelo.models.js';
import { ApiService } from '../../services/api.service.js';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vuelo',
  standalone: true,
  imports: [ CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './vuelo.component.html',
  styleUrl: './vuelo.component.css'
})
export class VueloComponent {

  vuelo:Vuelo | null = null; 
  vueloList:Vuelo[] = [];
  private _apiService = inject(ApiService) ; 
  private _fb = inject(FormBuilder) ; 

  url: string = 'http://localhost:3000/api/vuelo';
  view:string = 'default';
  id:string = '';
  vueloForm!: FormGroup;
  modificar:boolean = false;

  modificarVuelo(mod:boolean){
    this.modificar = mod
  };

  setView(viewName:string){
    this.view = viewName;

    if(this.view != 'buscar'){
      this.id= '';
      this.vuelo = null 
    }
  }


  getAllVuelo():void{
    this._apiService.getAll<Vuelo>(this.url).subscribe((data: Vuelo[]) =>{
      this.vueloList = data 
    })
  }

  getOneVuelo():void{
    if(this.id){
      this._apiService.getOne<Vuelo>(this.url, this.id).subscribe({
        next: (data:Vuelo) =>{
          this.vuelo = data
          console.log('Vuelo encontrado', data)
        },
        error: (error) => {
          console.error('Error al obtener el vuelo', error)
          alert('Hubo un error al obtener el vuelo');
        },
        complete: () => {
          console.log('Busqueda completada');
        }
      });
      } else {
      alert('Faltan datos para buscar el vuelo');
    }
  }


  initForm():void {
    this.vueloForm = this._fb.group({
      numero_vuelo: ['',[Validators.required,Validators.pattern(/^[a-zA-Z]{2,3}[0-9]{1,4}$/)]],
      fecha_salida: ['', Validators.required],
      fecha_llegada: ['', Validators.required],
      estado: ['', [Validators.required, Validators.pattern(/^(Volando|Aterrizando|Despegando|En Mantenimiento|En servicio|De baja|Reservado)$/i)]],
      id_avion: ['', [Validators.required, Validators.pattern(/^[0-9]{1,3}$/)]],
      id_aeropuerto_origen: ['', [Validators.required, Validators.pattern(/^[0-9]{1,3}$/)]],
      id_aeropuerto_destino: ['', [Validators.required, Validators.pattern(/^[0-9]{1,3}$/)]]
    })
  }


  submit(): void {
    if (this.vueloForm.valid) {
      const vuelo: Vuelo = this.vueloForm.value;
      this._apiService.add<Vuelo>(this.url, vuelo).subscribe({
        next: (response) => {
          console.log('Vuelo creado con éxito', response);
          alert('Vuelo cargado con éxito');
        },
        error: (error) => {
          console.error('Error al cargar el vuelo', error);
          if (error.status === 400 && error.error?.message) {
            alert(`Error: ${error.error.message}`); // Muestra el mensaje detallado del backend
          } else {
            alert('Error inesperado al cargar el vuelo.');
          }
        },
      });
    } else {
      console.log('Formulario no válido');
      alert('Error al cargar el vuelo: el formulario contiene datos inválidos.');
    }
  }

  updateVuelo():void{
    if(this.vueloForm.valid){
    if(this.vuelo && this.vuelo.id_vuelo){
      this._apiService.update<Vuelo>(this.url, this.vuelo.id_vuelo.toString(), this.vueloForm.value).subscribe({
        next: (response: Vuelo) => {
          console.log('Vuelo actualizado:', response);
          alert('Vuelo actualizado correctamente');
        },
        error: (error) => {
          console.error('Error al actualizar el Vuelo', error);
          alert('Hubo un error al actualizar el Vuelo');
        },
        complete: () => {
          console.log('Actualización completada');
        }
      });
    
    } } else {
      console.log('Formulario no válido');
      alert('Error al actualizar el vuelo: el formulario contiene datos inválidos');
    }
  }


  populateForm():void {
    if(this.vuelo){
      const formattedFechaSalida = new Date(this.vuelo.fecha_salida).toISOString().slice(0,16);
      const formattedFechaLlegada = new Date(this.vuelo.fecha_llegada).toISOString().slice(0,16);
      this.vueloForm.patchValue({
        numero_vuelo: this.vuelo.numero_vuelo,
        fecha_salida: formattedFechaSalida,
        fecha_llegada: formattedFechaLlegada,
        estado: this.vuelo.estado,
        id_avion: this.vuelo.id_avion,
        id_aeropuerto_origen: this.vuelo.id_aeropuerto_origen,
        id_aeropuerto_destino:this.vuelo.id_aeropuerto_destino
      })
    }
  }

  deleteVuelo():void {
    if(confirm('¿Estas seguro que desea eliminar este usuario?')){
      this._apiService.delete<Vuelo>(this.url, this.id).subscribe({
        next: () => {
          console.log(`Vuelo con ID ${this.id} eliminado`);
          alert('Vuelo eliminado con éxito');
          this.getAllVuelo();
          this.vuelo = null; 
          this.id = ''; 
        },
        error: (error) => {
          console.error('Error al eliminar el Vuelo:', error);
          alert('Hubo un error al eliminar el Vuelo');
        }
      })
    }
  }


}
