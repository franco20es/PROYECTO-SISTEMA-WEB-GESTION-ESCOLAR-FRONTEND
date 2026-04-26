import { AfterViewInit, Component, inject, OnDestroy } from '@angular/core';

import { Router, RouterOutlet } from '@angular/router';
import { UsuarioSidebar } from '../../../shared/components/sidebar/sidebar/sidebar';
import { Navbar } from '../../../shared/components/navbar/navbar/navbar';


@Component({
  selector: 'app-main-layout',
  imports: [ RouterOutlet,Navbar, UsuarioSidebar],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
   host: {
    '(window:resize)': 'onResize()'
  }
})
export class MainLayout implements AfterViewInit, OnDestroy {

 menu: any[] = [];

  ngOnInit(): void {
    const Role = "profesor"; // Reemplaza con la lógica real para obtener el rol del usuario
    const MENU_CONFIG: any = {
       admin: [
      {
        section: 'Principal',
        items: [
          { label: 'Dashboard', icon: 'bi bi-grid-1x2', route: 'dashboard' },
          { label: 'Estudiantes', icon: 'bi bi-people', route: 'estudiantes' },
          { label: 'Profesores', icon: 'bi bi-person', route: 'profesores' },
          { label: 'Cursos', icon: 'bi bi-book', route: 'cursos' }
        ]
      },
      {
        section: 'Administración',
        items: [
          { label: 'Matriculas', icon: 'bi bi-person-circle', route: 'matriculas' },
          { label: 'Asistencia', icon: 'bi bi-shield-lock', route: 'asistencia' },
          { label: 'Calificaciones', icon: 'bi bi-phone', route: 'calificaciones' },
          { label: 'Finanzas', icon: 'bi bi-cash', route: 'finanzas' }
        ]
      },
      {
        section: 'Sistema',
        items: [
          { label: 'Notificaciones', icon: 'bi bi-bell', route: 'notificaciones' },
          { label: 'Configuración', icon: 'bi bi-gear', route: 'configuracion' }
        ]
      }
    ],
       alumno: [
    {
      section: 'Principal',
      items: [
        { label: 'Dashboard', icon: 'bi bi-grid-1x2', route: 'dashboard' },
        { label: 'Mis Cursos', icon: 'bi bi-book', route: 'cursos' },
        { label: 'Mis Notas', icon: 'bi bi-file-earmark', route: 'notas' }
      ]
    },
    {
      section: 'Académico',
      items: [
        { label: 'Asistencia', icon: 'bi bi-check-circle', route: 'asistencia' },
        { label: 'Horario', icon: 'bi bi-calendar', route: 'horario' }
      ]
    },
    {
      section: 'Cuenta',
      items: [
        { label: 'Perfil', icon: 'bi bi-person-circle', route: 'perfil' },
        { label: 'Notificaciones', icon: 'bi bi-bell', route: 'notificaciones' }
      ]
    }
  ],
      profesor: [
  {
    section: 'Principal',
    items: [
      { label: 'Dashboard', icon: 'bi bi-grid-1x2', route: 'dashboard' },
      { label: 'Mis Cursos', icon: 'bi bi-book', route: 'cursos' },
      { label: 'Mis Estudiantes', icon: 'bi bi-people', route: 'estudiantes' }
    ]
  },
  {
    section: 'Académico',
    items: [
      { label: 'Asistencia', icon: 'bi bi-check-circle', route: 'asistencia' },
      { label: 'Calificaciones', icon: 'bi bi-journal-check', route: 'calificaciones' },
      { label: 'Evaluaciones', icon: 'bi bi-file-earmark-text', route: 'evaluaciones' }
    ]
  },
  {
    section: 'Gestión',
    items: [
      { label: 'Horario', icon: 'bi bi-calendar', route: 'horario' },
      { label: 'Reportes', icon: 'bi bi-bar-chart', route: 'reportes' }
    ]
  },
  {
    section: 'Cuenta',
    items: [
      { label: 'Perfil', icon: 'bi bi-person-circle', route: 'perfil' },
      { label: 'Notificaciones', icon: 'bi bi-bell', route: 'notificaciones' }
    ]
  }
]
    };
    this.menu = MENU_CONFIG[Role] || [];
  }

  private readonly router = inject(Router);

  state = {
    sidebarCollapsed: false,
    mobileSidebarOpen: false,
  };

  ngAfterViewInit(): void {
    this.registerGlobalHandlers();
    this.restoreSidebarCollapse();
    this.syncMainWrapperMargin();
    this.syncHamburgerIcon();
  }

  ngOnDestroy(): void {
    this.unregisterGlobalHandlers();
  }

  onNavigate(route: string): void {
    const target = this.normalizeRoute(route);
    this.router.navigate(['/admin', target]);

    if (this.isMobile()) {
      this.closeMobileSidebar();
    }
  }

  onResize(): void {
    if (!this.isMobile() && this.state.mobileSidebarOpen) {
      this.closeMobileSidebar();
    }
    this.syncMainWrapperMargin();
    this.syncHamburgerIcon();
  }

  toggleSidebar(): void {
    if (this.isMobile()) {
      this.state.mobileSidebarOpen ? this.closeMobileSidebar() : this.openMobileSidebar();
    } else {
      this.toggleCollapse();
    }
  }

  private isMobile(): boolean {
    return window.innerWidth < 1024;
  }

  private openMobileSidebar(): void {
    this.state.mobileSidebarOpen = true;

    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sbOverlay');
    const hamburger = document.getElementById('hamburger');

    sidebar?.classList.add('mobile-open');
    overlay?.classList.add('active');
    hamburger?.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    this.syncMainWrapperMargin();
    this.syncHamburgerIcon();
  }

  private closeMobileSidebar(): void {
    this.state.mobileSidebarOpen = false;

    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sbOverlay');
    const hamburger = document.getElementById('hamburger');

    sidebar?.classList.remove('mobile-open');
    overlay?.classList.remove('active');
    hamburger?.classList.remove('is-open');
    document.body.style.overflow = '';
    this.syncMainWrapperMargin();
    this.syncHamburgerIcon();
  }

  private toggleCollapse(): void {
    this.state.sidebarCollapsed = !this.state.sidebarCollapsed;
    const sb = document.getElementById('sidebar');
    sb?.classList.toggle('collapsed', this.state.sidebarCollapsed);

    try {
      localStorage.setItem('sb_collapsed', String(this.state.sidebarCollapsed));
    } catch (_e) {
      // Ignorar errores de storage en entornos restringidos
    }

    this.syncMainWrapperMargin();
    this.syncHamburgerIcon();
  }

  private restoreSidebarCollapse(): void {
    try {
      const saved = localStorage.getItem('sb_collapsed');
      if (saved === 'true') {
        this.state.sidebarCollapsed = true;
        document.getElementById('sidebar')?.classList.add('collapsed');
      }
    } catch (_e) {
      // Ignorar errores de storage en entornos restringidos
    }

    this.syncMainWrapperMargin();
    this.syncHamburgerIcon();
  }

  private syncMainWrapperMargin(): void {
    const wrapper = document.getElementById('mainWrapper') as HTMLElement | null;
    if (!wrapper) return;

    if (this.isMobile()) {
      wrapper.style.marginLeft = '0';
      return;
    }

    wrapper.style.marginLeft = this.state.sidebarCollapsed ? '68px' : '264px';
  }

  private syncHamburgerIcon(): void {
    const hamburger = document.getElementById('hamburger');
    if (!hamburger) return;

    if (this.isMobile()) {
      hamburger.classList.toggle('is-open', this.state.mobileSidebarOpen);
      return;
    }

    hamburger.classList.toggle('is-open', this.state.sidebarCollapsed);
  }

  private registerGlobalHandlers(): void {
    const w = window as unknown as Record<string, unknown>;
    w['toggleHamburger'] = () => this.toggleSidebar();
    w['openMobileSidebar'] = () => this.openMobileSidebar();
    w['closeMobileSidebar'] = () => this.closeMobileSidebar();
    w['toggleCollapse'] = () => this.toggleCollapse();
    w['showView'] = (route: unknown) => this.onNavigate(String(route || 'dashboard'));
    w['toast'] = () => undefined;
  }

  private unregisterGlobalHandlers(): void {
    const w = window as unknown as Record<string, unknown>;
    delete w['toggleHamburger'];
    delete w['openMobileSidebar'];
    delete w['closeMobileSidebar'];
    delete w['toggleCollapse'];
    delete w['showView'];
    delete w['toast'];
  }

  private normalizeRoute(route: string): string {
    const key = route.toLowerCase();

    // Lista de rutas válidas según el menú
    const validRoutes = [
      'dashboard', 'tickets', 'notificaciones', 'perfil',
      'cursos', 'estudiantes', 'profesores', 'matriculas', 'asistencia',
      'calificaciones', 'finanzas', 'configuracion', 'notas', 'horario', 'reportes', 'evaluaciones'
    ];

    if (validRoutes.includes(key)) {
      return key;
    }

    return 'dashboard';
  }
}

