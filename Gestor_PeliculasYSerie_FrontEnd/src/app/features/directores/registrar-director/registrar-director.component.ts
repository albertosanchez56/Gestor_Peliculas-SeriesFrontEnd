import { Component } from '@angular/core';
import { Director } from '../director';
import { FormsModule } from '@angular/forms';
import { DirectorService } from '../service/director.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrar-director',
  imports: [FormsModule],
  templateUrl: './registrar-director.component.html',
  styleUrl: './registrar-director.component.css'
  
})
export class RegistrarDirectorComponent {

  director : Director = new Director();

  constructor(private directorServicio: DirectorService, private router: Router) { }

  ngOnInit() : void {
    
  }

  guardarDirector() {
    this.directorServicio.registrarDirector(this.director).subscribe(
      () => this.irALaListaDeDirectores(),
      () => {
        // Aquí podrías mostrar un mensaje de error con un servicio de notificaciones si lo necesitas
      }
    );
  }

  irALaListaDeDirectores(){
    this.router.navigate(['/directores']);
  }

  onSubmit(){
    this.guardarDirector();
  }
}
