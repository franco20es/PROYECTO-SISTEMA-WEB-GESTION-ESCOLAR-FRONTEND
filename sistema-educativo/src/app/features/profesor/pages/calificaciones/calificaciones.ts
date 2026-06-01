import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';

@Component({
  selector: 'app-calificaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calificaciones.html',
  styleUrl: './calificaciones.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Calificaciones {

}
