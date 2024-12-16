import { Component } from '@angular/core';
import { Director } from '../director';
import { DirectorService } from '../director.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-actualizar-director',
  imports: [FormsModule, CommonModule],
  templateUrl: './actualizar-director.component.html',
  styleUrl: './actualizar-director.component.css'
})
export class ActualizarDirectorComponent {

  id:number
  director: Director = new Director();
  constructor(private directorService: DirectorService, private router: Router, private route: ActivatedRoute){ }
  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.directorService.obtenerDirectorPorId(this.id).pipe(
      tap(dato => {
        this.director = dato;
      }),
      catchError(error => {
        console.error(error);
        return of(null); // Retorna un observable vacío en caso de error
      })
    ).subscribe();
  }

  irAlaListaDeDirectores(){
    this.router.navigate(['/directores']);
    Swal.fire('Director actualizado', `El director ${this.director.name} ha sido actualizado con exito`, `success`);
  }

  onSubmit(): void{
    if(this.director){
      this.directorService.actualizarDirector(this.id, this.director).pipe(
        tap(dato => {
          this.irAlaListaDeDirectores();
        }),
        catchError(error => {
          console.error('Error al actualizar el director:', error);
          return of(null); // Retorna un observable vacío en caso de error
        })
      ).subscribe();
    }
  }
}
