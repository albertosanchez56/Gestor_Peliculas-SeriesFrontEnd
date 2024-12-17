import { Component } from '@angular/core';
import { Director } from '../director';
import { FormsModule } from '@angular/forms';
import { DirectorService } from '../../../director.service';
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
      (dato) => {
        console.log(dato);  // Verifica la respuesta
        this.irALaListaDeDirectores();
      },
      (error) => {
        console.log(error);  // Revisa el error si ocurre
      }
    );
  }

  irALaListaDeDirectores(){
    this.router.navigate(['/directores']);
  }

  onSubmit(){
    console.log(this.director);
    this.guardarDirector();
  }
}
