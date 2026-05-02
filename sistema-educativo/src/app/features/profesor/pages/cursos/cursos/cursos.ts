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
  imports: [FormsModule],
  templateUrl: './cursos.html',
  styleUrl: './cursos.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CursosProfesor {
  private readonly cursosService = inject(ProfesorCursosService);
  private readonly router = inject(Router);

  readonly niveles: NivelCurso[] = ['Primaria', 'Secundaria'];
  readonly estados: EstadoCurso[] = ['Activo', 'Inactivo', 'En revisión'];

  readonly profesorCodigo = signal(this.getProfesorCodigo());
  readonly searchTerm = signal(''); 
  readonly nivelSeleccionado = signal<NivelCurso | 'Todos'>('Todos');
  readonly estadoSeleccionado = signal<EstadoCurso | 'Todos'>('Todos');

  readonly cursos = signal<CursoProfesor[]>(
    this.cursosService.getCursosByProfesor(this.profesorCodigo()),
  );

  readonly cursosFiltrados = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const nivel = this.nivelSeleccionado();
    const estado = this.estadoSeleccionado();

    return this.cursos().filter((curso) => {
      const coincideBusqueda =
        term.length === 0 ||
        curso.nombre.toLowerCase().includes(term) ||
        curso.codigo.toLowerCase().includes(term) ||
        curso.area.toLowerCase().includes(term);

      const coincideNivel = nivel === 'Todos' || curso.nivel === nivel;
      const coincideEstado = estado === 'Todos' || curso.estado === estado;

      return coincideBusqueda && coincideNivel && coincideEstado;
    });
  });

  onSearchTerm(value: string): void {
    this.searchTerm.set(value);
  }

  onNivel(value: string): void {
    this.nivelSeleccionado.set(value as NivelCurso | 'Todos');
  }

  onEstado(value: string): void {
    this.estadoSeleccionado.set(value as EstadoCurso | 'Todos');
  }

  verDetalle(curso: CursoProfesor): void {
    this.router.navigate(['/profesor/cursos'], {
      queryParams: { action: 'detalle', codigo: curso.codigo },
    });
  }

  editarCurso(curso: CursoProfesor): void {
    this.router.navigate(['/profesor/cursos'], {
      queryParams: { action: 'editar', codigo: curso.codigo },
    });
  }

  registrarNotasAsistencia(curso: CursoProfesor): void {
    this.router.navigate(['/profesor/cursos'], {
      queryParams: { action: 'registro', codigo: curso.codigo },
    });
  }

  areaClass(area: string): string {
    const areaNormalizada = area.toLowerCase();
    if (areaNormalizada.includes('matem')) return 'area-matematicas';
    if (areaNormalizada.includes('comunic')) return 'area-comunicacion';
    if (areaNormalizada.includes('cien')) return 'area-ciencias';
    if (areaNormalizada.includes('hist')) return 'area-historia';
    if (areaNormalizada.includes('arte')) return 'area-arte';
    if (areaNormalizada.includes('ingl')) return 'area-ingles';
    return 'area-default';
  }

  estadoClass(estado: EstadoCurso): string {
    if (estado === 'Activo') return 'estado-activo';
    if (estado === 'Inactivo') return 'estado-inactivo';
    return 'estado-revision';
  }

  formatPromedio(promedio: number): string {
    return promedio.toFixed(1);
  }

  private getProfesorCodigo(): string {
    const raw = localStorage.getItem('usuario');
    if (!raw) return 'PROF-001';

    try {
      const usuario = JSON.parse(raw) as { codigo?: string; rol?: string };
      if (usuario.rol === 'profesor' && usuario.codigo) {
        return usuario.codigo;
      }
    } catch {
      return 'PROF-001';
    }

    return 'PROF-001';
  }
}
