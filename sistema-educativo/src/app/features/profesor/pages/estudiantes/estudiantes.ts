import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-estudiantes',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './estudiantes.html',
  styleUrl: './estudiantes.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Estudiantes {}
