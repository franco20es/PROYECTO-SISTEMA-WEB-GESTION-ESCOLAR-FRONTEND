import { ChangeDetectionStrategy, Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CursoDocenteService } from '../../../services/profesor-cursos.service'; 
import { ToastService } from '../../../../../core/services/toast/toast.service';
import { Toast } from '../../../../../core/components/toast/toast/toast';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [FormsModule, Toast],
  templateUrl: './cursos.html',
  styleUrl: './cursos.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CursosProfesor implements OnInit {
  private toastService  = inject(ToastService);
  private cursosService = inject(CursoDocenteService);
  private router        = inject(Router);

  // Paleta para asignar colores a los cursos
  private COLORES = ['#2A63E6', '#FF5B1F', '#00C27C', '#9B59B6', '#F5A623', '#E53030'];

  anio = new Date().getFullYear();

  // --- ESTADOS ---
  public cargando = signal<boolean>(true);
  public cursos = signal<any[]>([]);

  public activeCurso = signal<any | null>(null);
  public activeTab = signal<number>(0);
  public filterChip = signal<string>('Todos');
  public searchMaterialQuery = signal<string>('');

  public showUploadModal = signal<boolean>(false);
  public showAnuncioModal = signal<boolean>(false);

  public periodos = signal<string[]>([]);
  public periodoSeleccionado = signal<string>('');

  // Mock que queda para los tabs de detalle (se conectarán después)
  public unidades = signal<any[]>([]);
  public materiales = signal<any[]>([]);

  public filteredMateriales = computed(() => {
    const search = this.searchMaterialQuery().toLowerCase().trim();
    const chip = this.filterChip().toLowerCase();
    return this.materiales().filter(m => {
      const matchSearch = m.nm.toLowerCase().includes(search);
      const matchChip = chip === 'todos' || m.tipo.toLowerCase() === chip;
      return matchSearch && matchChip;
    });
  });

  ngOnInit(): void {
    this.periodos.set([`Año ${this.anio}`]);
    this.periodoSeleccionado.set(`Año ${this.anio}`);
    this.cargarCursos();
  }

  cargarCursos(): void {
    this.cargando.set(true);
    this.cursosService.misCursos(this.anio).subscribe({
      next: (data) => {
        const mapeados = (data || []).map((a, i) => ({
          id: a.cursoId,
          asignacionId: a.id,
          name: a.cursoNombre,
          codigo: a.cursoCodigo,
          color: this.COLORES[i % this.COLORES.length],
          secs: [a.seccionDenominacion],
          seccionId: a.seccionId,
          hor: '—',           // se puede conectar con horario después
          alum: 0,            // se puede conectar con conteo de matrículas
          mats: 0,
          evals: 0,
          prog: 0
        }));
        this.cursos.set(mapeados);
        this.cargando.set(false);
      },
      error: () => {
        this.cursos.set([]);
        this.cargando.set(false);
      }
    });
  }

  // --- CONTROL ---
  public openCurso(curso: any): void {
    // Guarda los cursos para que el detalle los lea
    sessionStorage.setItem('cursosDocente', JSON.stringify(this.cursos()));
    this.router.navigate(['/profesor/detalle-curso', curso.id]);
  }

  public closeDetail(): void {
    this.activeCurso.set(null);
  }

  public selectTab(index: number): void {
    this.activeTab.set(index);
  }

  public showToast(msg: string, type: string = 'info'): void {
    this.toastService.show(msg, type);
  }

  public toggleUnit(unit: any): void {
    unit.expanded = !unit.expanded;
  }
}