import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Director } from '../director';
import { DirectorService } from '../service/director.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lista-directores',
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-directores.component.html',
  styleUrl: './lista-directores.component.css'
})
export class ListaDirectoresComponent {

  directores: Director[] = [];
  searchInput = '';

  constructor(private directorServicio: DirectorService, private router: Router) {}

  ngOnInit(): void {
    this.obtenerDirectores();
  }

  get filteredDirectores(): Director[] {
    const q = this.searchInput.trim().toLowerCase();
    if (!q) return this.directores;
    return this.directores.filter(d => (d.name ?? '').toLowerCase().includes(q));
  }

  applySearch(): void {}

  agregarDirector(): void {
    this.router.navigate(['registrar-director']);
  }

  actualizarDirector(id: number): void {
    this.router.navigate(['actualizar-director', id]);
  }

  eliminarDirector(id: number): void {
    this.directorServicio.eliminarDirector(id).subscribe(() => {
      this.obtenerDirectores();
    });
  }

  private obtenerDirectores(): void {
    this.directorServicio.obtenerListaDeDirectores().subscribe(dato => {
      this.directores = dato ?? [];
    });
  }
}
