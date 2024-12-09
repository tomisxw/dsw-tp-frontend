import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from '../../../models/usuario.models.js';// Asegúrate de importar tu modelo
import { UsuarioService } from '../../../services/usuario.service.js';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-usuario-detail',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './usuario.details.component.html',
    styleUrls: ['./usuario.details.component.css']
})
export class UsuarioDetailComponent implements OnInit {
    usuario: Usuario | undefined;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private usuarioService: UsuarioService // Servicio para obtener los datos
    ) {}

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.usuarioService.obtenerUsuarioPorId(id).subscribe(
            (data) => (this.usuario = data),
            (error) => console.error('Error al cargar usuario:', error)
        );
    }

    volverALista(): void {
        this.router.navigate(['/usuario']);
    }
}
