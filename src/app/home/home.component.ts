import { Component } from '@angular/core';
import { CarouselComponent } from '../carousel/carousel.component'; 

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CarouselComponent], 
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {}