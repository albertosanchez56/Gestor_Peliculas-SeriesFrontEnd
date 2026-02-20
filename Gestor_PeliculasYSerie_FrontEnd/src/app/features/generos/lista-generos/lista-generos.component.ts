import { Component } from '@angular/core';
import { GeneroService } from '../service/genero.service';
import { Router } from '@angular/router';
import { Generos } from '../generos';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lista-generos',
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-generos.component.html',
  styleUrl: './lista-generos.component.css'
})
export class ListaGenerosComponent {

  generos: Generos[] = [];
  searchInput = '';

  constructor(private generoServicio: GeneroService, private router: Router) {}

  ngOnInit(): void {
    this.obtenerGeneros();
  }

  get filteredGeneros(): Generos[] {
    const q = this.searchInput.trim().toLowerCase();
    if (!q) return this.generos;
    return this.generos.filter(g => (g.name ?? '').toLowerCase().includes(q));
  }

  applySearch(): void {}

  agregarGenero(): void {
    this.router.navigate(['registrar-genero']);
  }

  actualizarGenero(id: number): void {
    this.router.navigate(['actualizar-genero', id]);
  }

  eliminarGenero(id: number): void {
    this.generoServicio.eliminarGenero(id).subscribe(() => {
      this.obtenerGeneros();
    });
  }

  private obtenerGeneros(): void {
    this.generoServicio.obtenerListaDeGeneros().subscribe(dato => {
      this.generos = dato ?? [];
    });
  }
}
