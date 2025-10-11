import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { Movies } from '../movies/movies';
import { MovieService } from '../movies/service/movie.service';

type CarouselItem = {
  img: string;
  title: string;
  rating: string | number;
  description: string;
  _empty?: boolean; // marcar el hueco vacío (opcional)
};


@Component({
  selector: 'app-index',
  imports: [CommonModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent implements OnInit {


  homeMovies: Movies[] = [];

  page = 0;
  size = 20;
  loading = false;

  carouselItems: CarouselItem[] = [];

  currentIndex = 0;
  itemsToMove = 5;
  partialVisibleWidth = 165;
  partialVisibleWidthHighRes = 520;
  initialMarginLeft = 175;
  initialMarginLeftHighRes = 230;


  constructor(@Inject(PLATFORM_ID) private platformId: Object, private moviesSvc: MovieService) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Solo se ejecutará en el navegador
      this.updateItemsToMove();
      this.toggleNavButtons(1);
    }
    this.cargarTopRatedParaCarrusel();
    this.cargarPeliculasGrid();
  }

  updateItemsToMove(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Solo se ejecutará en el navegador
      const screenWidth = window.innerWidth;
      if (screenWidth <= 480) {
        this.itemsToMove = 2;
      } else if (screenWidth <= 768) {
        this.itemsToMove = 3;
      } else if (screenWidth <= 1900) {
        this.itemsToMove = 5;
      } else {
        this.itemsToMove = 7;
      }


    }
  }

  private cargarTopRatedParaCarrusel() {
    this.loading = true;
    this.moviesSvc.getTopRated(19).subscribe({
      next: (movies) => {
        const items = movies.map(m => ({
          // preferimos poster; si no, backdrop; si no, vacío
          img: m.posterUrl || m.backdropUrl || '',
          title: m.title ?? '',
          rating: (typeof m.averageRating === 'number')
                    ? m.averageRating.toFixed(1) + '/10'
                    : '—',
          description: m.description ?? ''
        }));

        // exactamente 19 y añadimos 1 vacío al final
        this.carouselItems = items.slice(0, 19);
        this.carouselItems.push({ img: '', title: '', rating: '', description: '' });
      },
      error: () => {},
      complete: () => this.loading = false
    });
  }

  private cargarPeliculasGrid() {
    // lo que ya tenías para “Mis favoritos”
    this.moviesSvc.getAll(0, 20).subscribe({
      next: movies => this.homeMovies = movies.slice(0, 14)
    });
  }

  moveCarousel(direction: number): void {
    if (isPlatformBrowser(this.platformId)) {
      console.log('Moving carousel', direction); // Para depurar

      const carousel = document.querySelector('.carousel2') as HTMLElement;
      const wrapper = document.querySelector('.carousel-wrapper2') as HTMLElement;

      if (!carousel || !wrapper) return;

      const itemWidth = 290; // Ajusta el valor de itemWidth si es necesario
      const itemsCount = carousel.querySelectorAll('.carousel-item').length;
      console.log('itemsCount:', itemsCount);
      const visibleItems = Math.floor(wrapper.offsetWidth / itemWidth);
      console.log('visibleItems:', visibleItems);
      console.log('itemsToMove:', this.itemsToMove);

      // Cálculo actualizado para maxIndex
      //const maxIndex = Math.max(0, Math.ceil((itemsCount - visibleItems) / this.itemsToMove) * this.itemsToMove);
      const maxIndex = itemsCount - visibleItems;

      console.log('maxIndex', maxIndex);

      // Actualizar currentIndex según la dirección
      let newIndex = this.currentIndex + direction * this.itemsToMove;

      // Validar elementos restantes si nos acercamos al final
      const itemsRemaining = itemsCount - newIndex - visibleItems;
      if (itemsRemaining < 0 && itemsCount > visibleItems) {
        newIndex = itemsCount - visibleItems; // Mueve justo para mostrar los últimos ítems visibles
      }

      // Controlar los límites del carrusel
      if (newIndex < 0) newIndex = 0;
      if (newIndex > maxIndex) newIndex = maxIndex;

      this.currentIndex = newIndex;
      const screenWidth = window.innerWidth;
      // Calcular el desplazamiento
      /*if (screenWidth >= 2000) {
        let offset = this.currentIndex * itemWidth - this.partialVisibleWidthHighRes;
        if (this.currentIndex === 0) offset = 0;
        carousel.style.transform = `translateX(-${offset}px)`;
      } else if (screenWidth >= 768){
        let offset = this.currentIndex * itemWidth - this.partialVisibleWidth;
        if (this.currentIndex === 0) offset = 0;
        carousel.style.transform = `translateX(-${offset}px)`;
      }
      else {
        let offset = this.currentIndex * itemWidth - this.partialVisibleWidth;
        if (this.currentIndex === 0) offset = 0;
        carousel.style.transform = `translateX(-${offset}px)`;
      }*/
      const partialWidth = screenWidth >= 2000 ? this.partialVisibleWidthHighRes : this.partialVisibleWidth;
      let offset = this.currentIndex * itemWidth - partialWidth;
      if (this.currentIndex === 0) offset = 0;
      carousel.style.transform = `translateX(-${offset}px)`;

      //let offset = this.currentIndex * itemWidth - this.partialVisibleWidth;


      // Aplicar la transformación para mover el carrusel


      // Ajustar el margen si la pantalla es mayor a 768px

      if (screenWidth >= 2000) {
        wrapper.style.marginLeft = this.currentIndex === 0 ? `${this.initialMarginLeftHighRes}px` : '0';
      } else if (screenWidth >= 768) {
        wrapper.style.marginLeft = this.currentIndex === 0 ? `${this.initialMarginLeft}px` : '0';
      }
      else {
        wrapper.style.marginLeft = '0';
      }
      console.log('currentIndex', this.currentIndex);
      // Llamar a toggleNavButtons para controlar la visibilidad de los botones
      this.toggleNavButtons(maxIndex);
    }
  }





  toggleNavButtons(maxIndex: number): void {
    if (isPlatformBrowser(this.platformId)) {
      const prevBtn = document.querySelector('.prev-btn') as HTMLElement;
      const nextBtn = document.querySelector('.next-btn') as HTMLElement;

      if (!prevBtn || !nextBtn) return;

      // Mostrar u ocultar el botón "prev"
      if (this.currentIndex === 0) {
        prevBtn.style.display = 'none';
      } else {
        prevBtn.style.display = 'block';
      }

      // Mostrar u ocultar el botón "next"
      if (this.currentIndex >= maxIndex) {
        nextBtn.style.display = 'none'; // Oculta el botón si estamos en el último set de ítems
      } else {
        nextBtn.style.display = 'block'; // Muestra el botón si hay más ítems por mostrar
      }
    }
  }



  @HostListener('window:resize', ['$event'])
  onResize(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Solo se ejecutará en el navegador
      this.updateItemsToMove();
    }
  }
}