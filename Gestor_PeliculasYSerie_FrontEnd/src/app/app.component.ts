import { Component, HostListener, Renderer2 } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ListaDirectoresComponent } from "./features/directores/lista-directores/lista-directores.component";
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MovieService, MovieSuggestionDTO } from './features/movies/service/movie.service';
import { debounceTime, distinctUntilChanged, switchMap, tap, of } from 'rxjs';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ListaDirectoresComponent, RouterLink, FormsModule, CommonModule, ReactiveFormsModule],
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


  qCtrl = new FormControl<string>('', { nonNullable: true });
  suggestions: MovieSuggestionDTO[] = [];

  isLoggedIn = false;
  isAdmin = false;
  displayName = '';

  constructor(private movieSvc: MovieService, private router: Router, private renderer: Renderer2, private auth: AuthService) { }

  ngOnInit() {
    // Autocomplete reactivo
    this.qCtrl.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(q => {
        const text = (q ?? '').trim();
        if (!text) {
          this.suggestions = [];
          return of([]);
        }
        return this.movieSvc.searchSuggestions(text, 8);
      }),
      tap(rows => this.suggestions = rows)
    ).subscribe();

    this.auth.user$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.isAdmin = user?.role === 'ADMIN';
      this.displayName = user?.displayName ?? user?.username ?? '';
    });

    this.auth.loadMe().subscribe();

  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/Home']);
  }

  toggleAdminMenu(ev?: Event): void {
    ev?.stopPropagation();

    // ✅ si abres admin, cierra el buscador
    if (!this.isAdminMenuOpen) {
      this.searchOpen = false;
    }

    this.isAdminMenuOpen = !this.isAdminMenuOpen;
  }

  @HostListener('document:click')
  onDocClick(): void {
    this.isAdminMenuOpen = false;
  }

  closeAdminMenu(): void {
    this.isAdminMenuOpen = false;
  }


  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;

    // Solo aplicar en móvil
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    const el = document.querySelector('nav .search-container') as HTMLElement | null;

    if (!el) return;

    if (isMobile) {
      // Ajusta aquí los valores que te cuadran en tu layout
      const topWhenOpen = '-1px';
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
    this.router.navigate(['/movies'], {
      queryParams: { q: term, page: 0 },   // usa 'q', no 'term'
      queryParamsHandling: 'merge'
    });
    this.searchOpen = false;
  }

  toggleSearch(): void {
    this.searchOpen = !this.searchOpen;
    if (this.searchOpen) {
      // foco al input en el siguiente tick
      setTimeout(() => {
        const el = document.querySelector<HTMLInputElement>('.search-input');
        el?.focus();
      }, 0);
    } else {
      this.suggestions = [];
      this.qCtrl.setValue('', { emitEvent: false });
    }
  }

  closeSearch(): void {
    this.searchOpen = false;
    this.suggestions = [];
  }

  onSubmitSearch(ev?: Event): void {
    ev?.preventDefault();               // ← evita recarga de la página
    const q = this.qCtrl.value.trim();
    // Navega a la página de películas con ?q=...
    this.router.navigate(['/movies'], {
      queryParams: { q: q || null, page: 0 },   // resetea a página 0
      queryParamsHandling: 'merge'
    });
    this.closeSearch();
  }

  onPickSuggestion(s: MovieSuggestionDTO): void {
    // Ir al detalle directamente
    this.router.navigate(['/movies', s.id]);
    this.closeSearch();
  }

}
