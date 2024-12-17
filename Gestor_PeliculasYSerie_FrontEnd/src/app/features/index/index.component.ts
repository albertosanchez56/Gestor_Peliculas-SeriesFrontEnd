import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, HostListener, Inject, PLATFORM_ID } from '@angular/core';


@Component({
  selector: 'app-index',
  imports: [ CommonModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent implements OnInit{
  carouselItems = [
    { img: 'assets/imagenes/Taxi.jpg', title: 'Taxi Driver', rating: '8,2/10', description: 'Un veterano con problemas de salud mental trabaja como taxista en Nueva York.' },
    { img: 'assets/imagenes/akira.jpg', title: 'Taxi Driver', rating: '8,2/10', description: 'Un veterano con problemas de salud mental trabaja como taxista en Nueva York.' },
    { img: 'assets/imagenes/terminator.jpg', title: 'Taxi Driver', rating: '8,2/10', description: 'Un veterano con problemas de salud mental trabaja como taxista en Nueva York.' },
    { img: 'assets/imagenes/pulp.jpeg', title: 'Taxi Driver', rating: '8,2/10', description: 'Un veterano con problemas de salud mental trabaja como taxista en Nueva York.' },
    { img: 'assets/imagenes/logan.jpg', title: 'Taxi Driver', rating: '8,2/10', description: 'Un veterano con problemas de salud mental trabaja como taxista en Nueva York.' },
    { img: 'assets/imagenes/regreso.jpg', title: 'Taxi Driver', rating: '8,2/10', description: 'Un veterano con problemas de salud mental trabaja como taxista en Nueva York.' },
    { img: 'assets/imagenes/akira.jpg', title: 'Taxi Driver', rating: '8,2/10', description: 'Un veterano con problemas de salud mental trabaja como taxista en Nueva York.' },
    { img: 'assets/imagenes/pulp.jpeg', title: 'Taxi Driver', rating: '8,2/10', description: 'Un veterano con problemas de salud mental trabaja como taxista en Nueva York.' },
    { img: 'assets/imagenes/pulp.jpeg', title: 'Taxi Driver', rating: '8,2/10', description: 'Un veterano con problemas de salud mental trabaja como taxista en Nueva York.' },
    { img: 'assets/imagenes/pulp.jpeg', title: 'Taxi Driver', rating: '8,2/10', description: 'Un veterano con problemas de salud mental trabaja como taxista en Nueva York.' },
    { img: 'assets/imagenes/pulp.jpeg', title: 'Taxi Driver', rating: '8,2/10', description: 'Un veterano con problemas de salud mental trabaja como taxista en Nueva York.' },
    { img: 'assets/imagenes/pulp.jpeg', title: 'Taxi Driver', rating: '8,2/10', description: 'Un veterano con problemas de salud mental trabaja como taxista en Nueva York.' },
    { img: 'assets/imagenes/akira.jpg', title: 'Taxi Driver', rating: '8,2/10', description: 'Un veterano con problemas de salud mental trabaja como taxista en Nueva York.' },
    { img: '', title: '', rating: '', description: '' }
  ];

  currentIndex = 0;
  itemsToMove = 5;
  partialVisibleWidth = 165;
  initialMarginLeft = 165;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Solo se ejecutará en el navegador
      this.updateItemsToMove();
      this.toggleNavButtons(1);
    }
  }

  updateItemsToMove(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Solo se ejecutará en el navegador
      const screenWidth = window.innerWidth;
      if (screenWidth <= 480) {
        this.itemsToMove = 2;
      } else if (screenWidth <= 768) {
        this.itemsToMove = 3;
      } else {
        this.itemsToMove = 5;
      }
    }
  }

  moveCarousel(direction: number): void {
    if (isPlatformBrowser(this.platformId)) {
        console.log('Moving carousel', direction); // Para depurar

        const carousel = document.querySelector('.carousel2') as HTMLElement;
        const wrapper = document.querySelector('.carousel-wrapper2') as HTMLElement;

        if (!carousel || !wrapper) return;

        const itemWidth = 306; // Ajusta el valor de itemWidth si es necesario
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

        // Calcular el desplazamiento
        let offset = this.currentIndex * itemWidth - this.partialVisibleWidth;
        if (this.currentIndex === 0) offset = 0;

        // Aplicar la transformación para mover el carrusel
        carousel.style.transform = `translateX(-${offset}px)`;

        // Ajustar el margen si la pantalla es mayor a 768px
        const screenWidth = window.innerWidth;
        if (screenWidth >= 768) {
            wrapper.style.marginLeft = this.currentIndex === 0 ? `${this.initialMarginLeft}px` : '0';
        } else {
            wrapper.style.marginLeft = '0';
        }
        console.log('currentIndex',  this.currentIndex);
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
      if (this.currentIndex >= maxIndex ) {
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