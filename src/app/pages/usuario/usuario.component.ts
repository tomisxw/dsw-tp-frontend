import { Component, inject } from '@angular/core';
import { ApiService } from '../../services/api.service.js';
import { Usuario } from '../../models/usuario.models.js';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent{


  usuario:Usuario | null = null;
  usuarioList: Usuario[] = [] ; 
  private _apiService = inject(ApiService) ;
  private _fb = inject(FormBuilder);

  url:string = 'http://localhost:3000/api/usuario' ;
  view:string = 'default';
  id:string = '' ; 
  usuarioForm!: FormGroup ; 
  modificar:boolean = false ; 

  modificarUsuario(mod:boolean){
    this.modificar = mod
  };

  setView(viewName:string){
    this.view = viewName;

    if (this.view != 'buscar') {
      this.id = '';  
      this.usuario = null
    }
  }

  getAllUsuario(): void {
    this._apiService.getAll<Usuario>(this.url).subscribe((data: Usuario[]) =>{
      this.usuarioList = data; 
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

  

  initForm(): void {
    this.usuarioForm = this._fb.group({
      usuario: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      rol: ['', Validators.required],
      dni: ['', Validators.required],
      telefono: ['', Validators.required],
      fecha_registro: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required]
    });
  }


  submit():void {
    if (this.usuarioForm.valid){
      const usuario: Usuario = this.usuarioForm.value;
      this._apiService.add<Usuario>(this.url, usuario).subscribe(
        (response) => {
          console.log('Usuario creado con exito',response)
        }
      )
    }else {
      console.log('Formulario no valido')
    }
  }


  updateUsuario():void{
    if (this.usuario && this.usuario.id_usuario) {
      this._apiService.update<Usuario>(this.url, this.usuario.id_usuario.toString(), this.usuarioForm.value).subscribe({
        next: (response: Usuario) => {
          console.log('Usuario actualizado:', response);
          alert('Usuario actualizado correctamente');
        },
        error: (error) => {
          console.error('Error al actualizar el usuario', error);
          alert('Hubo un error al actualizar el usuario');
        },
        complete: () => {
          console.log('Actualización completada');
        }
      });
    
    }
  }

  populateForm(): void {
    if (this.usuario) {
      const formattedFechaRegistro = new Date(this.usuario.fecha_registro).toISOString().slice(0, 16);
      const formattedFechaNacimiento = new Date(this.usuario.fecha_nacimiento).toISOString().slice(0, 10);
      this.usuarioForm.patchValue({
        usuario: this.usuario.usuario,
        email: this.usuario.email,
        rol: this.usuario.rol,
        dni: this.usuario.dni,
        telefono: this.usuario.telefono,
        fecha_registro: formattedFechaRegistro,
        fecha_nacimiento: formattedFechaNacimiento
      });
    }
  }
  deleteUsuario(): void {
    if (confirm('¿Está seguro que desea eliminar este usuario?')) {
      this._apiService.delete<Usuario>(this.url, this.id).subscribe({
        next: () => {
          console.log(`Usuario con ID ${this.id} eliminado`);
          alert('Usuario eliminado con éxito');
          this.getAllUsuario();
          this.usuario= null;
          this.id = '';
        },
        error: (error) => {
          console.error('Error al eliminar el usuario:', error);
          alert('Hubo un error al eliminar el usuario');
        }
      });
    }
  }










}
