import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component, Input, Output, EventEmitter, ChangeDetectionStrategy,
  ViewChild, ElementRef, HostListener, Inject, PLATFORM_ID, OnChanges, SimpleChanges, AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';

export type CarouselItem = {
  img: string;
  title: string;
  rating: string | number;
  description: string;
};

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarouselComponent implements OnChanges, AfterViewInit {
  @Input() title = '';
  @Input() items: CarouselItem[] = [];
  @Input() steps = 5;
  @Input() itemWidth = 290;
  @Input() leftPadding = 175;
  @Input() responsiveSteps = true; // NUEVO: que el componente ajuste el paso solo

  @Output() itemClick = new EventEmitter<CarouselItem>();

  @ViewChild('wrapper', { static: true }) wrapper!: ElementRef<HTMLElement>;
  @ViewChild('track',   { static: true }) track!: ElementRef<HTMLElement>;

  currentIndex = 0;
  maxIndex = 0;
  showPrev = false;
  showNext = true;

  private computedSteps = this.steps;

  private get stepSize(): number {
  return this.responsiveSteps ? this.computedSteps : this.steps;
  }

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    // haz un primer layout cuando ya existe el DOM
    this.runInitialLayout();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // cuando cambian los items desde el padre, recalcula el layout
    if (changes['items'] && this.wrapper) {
      this.currentIndex = 0;
      this.runInitialLayout();
    }
  }

  

  move(dir: number): void {
  if (!isPlatformBrowser(this.platformId)) return;

  const jump = this.stepSize; // <-- usar paso efectivo
  let next = this.currentIndex + dir * jump;
  if (next < 0) next = 0;
  if (next > this.maxIndex) next = this.maxIndex;

  this.currentIndex = next;
  this.applyTransform();
  this.updateNav();
}

  private recalcAll(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.recomputeMaxIndex();
    this.applyTransform();
    this.updateNav();
  }

  private recomputeMaxIndex(): void {
  if (!isPlatformBrowser(this.platformId)) return;
  const w = this.wrapper.nativeElement.offsetWidth;
  const visible = Math.max(1, Math.floor(w / this.itemWidth));
  const count = this.items?.length ?? 0;
  this.maxIndex = Math.max(0, count - visible);

  // NUEVO: paso responsive (p. ej., mover tantos como caben a la vista)
  // Ajusta a tu gusto: visible, visible-1, o clamp.
  this.computedSteps = Math.max(1, visible - 1);

  if (this.currentIndex > this.maxIndex) {
    this.currentIndex = this.maxIndex;
  }
}


  private applyTransform(): void {
    const track = this.track?.nativeElement;
    if (!track) return;
    let offset = this.currentIndex * this.itemWidth - this.leftPadding;
    if (this.currentIndex === 0) offset = 0;
    track.style.transform = `translateX(-${offset}px)`;
  }

  private updateNav(): void {
    this.showPrev = this.currentIndex > 0;
    this.showNext = this.currentIndex < this.maxIndex;
  }

  private runInitialLayout(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.recomputeMaxIndex();
        this.applyTransform();
        this.updateNav();
        this.cdr.markForCheck();  // por si usas OnPush
      });
    });
  }

  @HostListener('window:load')
  onWindowLoad(): void {
    this.runInitialLayout();
  }

  @HostListener('window:resize')
  onResize(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.recomputeMaxIndex();
    this.applyTransform();
    this.updateNav();
    this.cdr.markForCheck(); // asegura refresco
  }
}
