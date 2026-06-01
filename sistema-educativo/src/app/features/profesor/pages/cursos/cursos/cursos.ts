import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  CursoProfesor,
  EstadoCurso,
  NivelCurso,
} from '../../../models/curso-profesor.model';
import { ProfesorCursosService } from '../../../services/profesor-cursos.service';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './cursos.html',
  styleUrl: './cursos.css',
  
})
export class CursosProfesor {
  
}
