import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service.js';
import { Usuario } from '../../models/usuario.models.js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent{

  usuario:Usuario | null = null;
  usuarioList: Usuario[] = [] ; 
  private _apiService = inject(ApiService) ;
  
  url:string = 'http://localhost:3000/api/usuario' ;
  view:string = 'default';
  id:string = '' ; 

  setView(viewName:string){
    this.view = viewName;
    console.log(this.view)
  }

  getAllUsuario(): void {
    this._apiService.getAll<Usuario>(this.url).subscribe((data: Usuario[]) =>{
      this.usuarioList = data; 
      console.log(this.usuarioList);
    });
  }

  getOneUsuario(): void{
    if (this.id){
      this._apiService.getOne<Usuario>(this.url, this.id).subscribe(
        (data: Usuario) => {
          this.usuario = data 
        }
      )
    }
  }

}
