import { Component, OnDestroy, AfterViewInit, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { UsuarioSidebar } from '../../sidebar/sidebar/sidebar';
import { Navbar } from '../../nabvar/navbar/navbar';

@Component({
  selector: 'app-app-shell',
  imports: [RouterOutlet, UsuarioSidebar, Navbar],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.css',
  host: {
    '(window:resize)': 'onResize()'
  }
})
export class AppShell implements AfterViewInit, OnDestroy {
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
    this.router.navigate(['/user', target]);

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

    if (key === 'dashboard' || key === 'tickets' || key === 'notificaciones' || key === 'perfil') {
      return key;
    }

    return 'dashboard';
  }
}
