import { AfterViewInit, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { UsuarioSidebar } from '../../../shared/components/sidebar/sidebar/sidebar';
import { Navbar } from '../../../shared/components/navbar/navbar/navbar';
import { MENU_CONFIG } from '../../../core/config/menu.config';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, Navbar, UsuarioSidebar],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
  host: {
    '(window:resize)': 'onResize()'
  }
})
export class MainLayout implements OnInit, AfterViewInit, OnDestroy {

  menu: any[] = [];
  private readonly router = inject(Router);

  state = {
    sidebarCollapsed: false,
    mobileSidebarOpen: false,
  };

  //  Detecta automáticamente el rol según la URL
  ngOnInit(): void {
    const url = this.router.url;

    let role = '';

    if (url.startsWith('/admin')) {
      role = 'admin';
    } else if (url.startsWith('/alumno')) {
      role = 'alumno';
    } else if (url.startsWith('/profesor')) {
      role = 'profesor';
    }

    this.menu = MENU_CONFIG[role] || [];
  }

  ngAfterViewInit(): void {
    this.registerGlobalHandlers();
    this.restoreSidebarCollapse();
    this.syncMainWrapperMargin();
    this.syncHamburgerIcon();
  }

  ngOnDestroy(): void {
    this.unregisterGlobalHandlers();
  }

  //  NAVEGACIÓN SIMPLE Y CORRECTA
  onNavigate(route: string): void {
    this.router.navigateByUrl(route);

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

    document.getElementById('sidebar')?.classList.add('mobile-open');
    document.getElementById('sbOverlay')?.classList.add('active');
    document.getElementById('hamburger')?.classList.add('is-open');

    document.body.style.overflow = 'hidden';
    this.syncMainWrapperMargin();
    this.syncHamburgerIcon();
  }

  private closeMobileSidebar(): void {
    this.state.mobileSidebarOpen = false;

    document.getElementById('sidebar')?.classList.remove('mobile-open');
    document.getElementById('sbOverlay')?.classList.remove('active');
    document.getElementById('hamburger')?.classList.remove('is-open');

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
    } catch {}

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
    } catch {}

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

  //  IMPORTANTE: ya NO usa dashboard por defecto
  private registerGlobalHandlers(): void {
    const w = window as any;

    w.toggleHamburger = () => this.toggleSidebar();
    w.openMobileSidebar = () => this.openMobileSidebar();
    w.closeMobileSidebar = () => this.closeMobileSidebar();
    w.toggleCollapse = () => this.toggleCollapse();

    //  ahora no rompe rutas
    w.showView = (route: string) => this.onNavigate(route);

    w.toast = () => {};
  }

  private unregisterGlobalHandlers(): void {
    const w = window as any;

    delete w.toggleHamburger;
    delete w.openMobileSidebar;
    delete w.closeMobileSidebar;
    delete w.toggleCollapse;
    delete w.showView;
    delete w.toast;
  }
}
