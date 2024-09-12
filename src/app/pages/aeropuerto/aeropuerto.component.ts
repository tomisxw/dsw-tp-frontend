import { Component, inject, OnInit } from '@angular/core';
import { Aeropuerto } from '../../models/aeropuerto.models.js';
import { ApiService } from '../../services/api.service.js';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-aeropuerto',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './aeropuerto.component.html',
  styleUrl: './aeropuerto.component.css'
})
export class AeropuertoComponent{

  aeropuerto:Aeropuerto | null = null;
  aeropuertoList: Aeropuerto[] = [] ;
  private _apiService = inject(ApiService);

  url:string = 'http://localhost:3000/api/aeropuerto' ;
  public view:string = 'default';
  id:string = '';

  setView(viewName:string){
    this.view = viewName
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


}
