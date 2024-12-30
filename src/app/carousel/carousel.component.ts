import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carousel',
  standalone: true,
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
  imports: [CommonModule]
})
export class CarouselComponent {
  slides = [
    { image: 'assets/images/banner1.png', alt: 'Banner 1', title: 'Unidos en la excelencia deportiva', description: 'Descubre nuestros eventos destacados.' },
    { image: 'assets/images/banner2.png', alt: 'Banner 2', title: 'Creciendo juntos', description: 'Únete a la comunidad deportiva.' },
    { image: 'assets/images/banner3.png', alt: 'Banner 3', title: 'Logros que inspiran', description: 'Sé parte de nuestros triunfos.' }
  ];

  currentIndex = 0;

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number) {
    this.currentIndex = index;
  }
}