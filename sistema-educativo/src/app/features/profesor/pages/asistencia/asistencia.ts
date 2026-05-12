import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-asistencia',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './asistencia.html',
  styleUrl: './asistencia.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Asistencia {

}
