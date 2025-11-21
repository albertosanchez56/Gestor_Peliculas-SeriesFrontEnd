import { Component, Renderer2 } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ListaDirectoresComponent } from "./features/directores/lista-directores/lista-directores.component";
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ListaDirectoresComponent, RouterLink, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Gestor_PeliculasYSerie_FrontEnd';
  isAdminMenuOpen: boolean = false;
  isMenuOpen = false;

  searchOpen = false;
  menuOpen = false;   // si usas el menú móvil
  q = '';

  constructor(private router: Router, private renderer: Renderer2) {}

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;

    // Solo aplicar en móvil
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    const el = document.querySelector('nav .search-container') as HTMLElement | null;

    if (!el) return;

    if (isMobile) {
      // Ajusta aquí los valores que te cuadran en tu layout
      const topWhenOpen  = '-1px';
      const topWhenClose = '-10px';
      this.renderer.setStyle(el, 'top', this.isMenuOpen ? topWhenOpen : topWhenClose);
    } else {
      // En escritorio no forzamos posición desde TS
      this.renderer.removeStyle(el, 'top');
    }
  }
  onSearch(): void {
    const term = this.q.trim();
    if (!term) return;
    // Navega a tu página de películas con query param
    this.router.navigate(['/movies'], { queryParams: { q: term } });
    // (opcional) cierra la barra tras buscar
    // this.searchOpen = false;
}

}
