import { Component } from '@angular/core';
import { Generos } from '../generos';
import { GeneroService } from '../service/genero.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registrar-generos',
  imports: [FormsModule],
  templateUrl: './registrar-generos.component.html',
  styleUrl: './registrar-generos.component.css'
})
export class RegistrarGenerosComponent {

   genero : Generos = new Generos();
  
    constructor(private generoService: GeneroService, private router: Router) { }
  
    ngOnInit() : void {
      
    }
  
    guardarGenero() {
      this.generoService.registrarGenero(this.genero).subscribe(
        () => this.irALaListaDeGeneros(),
        () => {
          // Aquí podrías mostrar un mensaje de error con un servicio de notificaciones si lo necesitas
        }
      );
    }
  
    irALaListaDeGeneros(){
      this.router.navigate(['/generos']);
    }
  
    onSubmit(){
      this.guardarGenero();
    }
}
