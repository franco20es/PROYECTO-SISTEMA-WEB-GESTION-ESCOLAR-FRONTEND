import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-spiner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spiner.html',
  styleUrl: './spiner.css',
})
export class SpinnerComponent {
  @Input() isLoading: boolean = false;
}
