import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component.js';
import { UsuarioComponent } from './pages/usuario/usuario.component.js';
import { AvionComponent } from './pages/avion/avion.component.js';
import { AeropuertoComponent } from './pages/aeropuerto/aeropuerto.component.js';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'usuario', component: UsuarioComponent},
    {path: 'avion', component: AvionComponent},
    {path: 'aeropuerto', component: AeropuertoComponent},
    {path: '**', redirectTo: '', pathMatch:'full'},
];
