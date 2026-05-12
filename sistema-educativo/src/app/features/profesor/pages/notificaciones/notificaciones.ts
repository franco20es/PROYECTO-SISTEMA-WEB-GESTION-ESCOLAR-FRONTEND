import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';



@Component({
  selector: 'app-notificaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notificaciones.html',
  styleUrl: './notificaciones.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Notificaciones {


}

