import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component.js';
import { UsuarioComponent } from './pages/usuario/usuario.component.js';
import { UsuarioDetailComponent } from './pages/usuario/usuario.details/usuario.details.component.js';
import { AvionComponent } from './pages/avion/avion.component.js';
import { AeropuertoComponent } from './pages/aeropuerto/aeropuerto.component.js';
import { AeropuertoDetailComponent } from './pages/aeropuerto/aeropuerto.details/aeropuerto.details.component.js';
import { VueloComponent } from './pages/vuelo/vuelo.component.js';
import { MantenimientoComponent } from './pages/mantenimiento/mantenimiento.component.js';
import { PasajeComponent } from './pages/pasaje/pasaje.component.js';
import { ProvinciaComponent } from './pages/provincia/provincia.component.js';
import { LocalidadComponent } from './pages/localidad/localidad.component.js';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'usuario', component: UsuarioComponent},
    {path: 'usuarios/:id', component: UsuarioDetailComponent},
    {path: 'avion', component: AvionComponent},
    {path: 'aeropuerto', component: AeropuertoComponent},
    {path: 'aeropuertos/:id', component: AeropuertoDetailComponent},
    {path: 'vuelo', component: VueloComponent },
    {path: 'mantenimiento', component: MantenimientoComponent},
    {path: 'pasaje', component: PasajeComponent},
    {path: 'provincia', component: ProvinciaComponent},
    {path: 'localidad', component: LocalidadComponent},

    {path: '**', redirectTo: '', pathMatch:'full'},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }