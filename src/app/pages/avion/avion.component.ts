import { Component, inject, OnInit } from '@angular/core';
import { Avion } from '../../models/avion.models.js';
import { ApiService } from '../../services/api.service.js';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../models/usuario.models.js';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-avion',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './avion.component.html',
  styleUrl: './avion.component.css'
})
export class AvionComponent {

  avion:Avion | null = null;
  avionList: Avion[] = [];
  private _apiService = inject(ApiService)

  url:string = 'http://localhost:3000/api/avion';
  public view:string = 'default' ;
  id:string = '';

  setView(viewName:string){
    this.view = viewName
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


}
