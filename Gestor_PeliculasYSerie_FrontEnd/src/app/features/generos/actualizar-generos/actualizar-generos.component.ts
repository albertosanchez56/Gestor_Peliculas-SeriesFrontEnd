import { Component } from '@angular/core';
import { Generos } from '../generos';
import { GeneroService } from '../service/genero.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-actualizar-generos',
  imports: [FormsModule, CommonModule],
  templateUrl: './actualizar-generos.component.html',
  styleUrl: './actualizar-generos.component.css'
})
export class ActualizarGenerosComponent {

    id:number
    genero: Generos = new Generos();
    constructor(private generoService: GeneroService, private router: Router, private route: ActivatedRoute){ }
    ngOnInit(): void {
      this.id = this.route.snapshot.params['id'];
  
      this.generoService.obtenerGeneroPorId(this.id).pipe(
        tap(dato => {
          this.genero = dato;
        }),
        catchError(error => {
          console.error(error);
          return of(null); // Retorna un observable vacío en caso de error
        })
      ).subscribe();
    }
  
    irAlaListaDeGeneros(){
      this.router.navigate(['/generos']);
      Swal.fire('Genero actualizado', `El genero ${this.genero.name} ha sido actualizado con exito`, `success`);
    }
  
    onSubmit(): void {
      if (this.genero) {
        this.generoService.checkIfNameExists(this.genero.name).subscribe(
          (exists: boolean) => {
            if (exists) {
              Swal.fire({
                icon: 'warning',
                title: 'Nombre duplicado',
                text: 'El nombre ya existe en la base de datos. Por favor, elige otro.',
              });
            } else {
              this.actualizarGenero();
            }
          },
          error => {
            console.error('Error al verificar el nombre:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un problema al verificar el nombre.',
            });
          }
        );
      }
    }
    
    actualizarGenero(): void {
      this.generoService.actualizarGenero(this.id, this.genero).pipe(
        tap(dato => {
          this.irAlaListaDeGeneros();
        }),
        catchError(error => {
          console.error('Error al actualizar el género:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al actualizar el género.',
          });
          return of(null);
        })
      ).subscribe();
    }
    
    
}
