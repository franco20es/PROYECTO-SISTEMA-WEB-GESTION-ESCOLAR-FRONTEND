import { Component, EventEmitter, HostListener, Output, OnInit, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NotificacionNavbarService } from '../../../../core/services/navbar/nabvar.service'; 

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {

  scrolled = false;
  mobileMenuOpen = false;
  userMenuOpen = false;

  currentModule = 'Dashboard';
  currentPage = 'Dashboard';

  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() navigate = new EventEmitter<string>();

  private router = inject(Router);
  notiService = inject(NotificacionNavbarService);   // público para usarlo en el HTML

  ngOnInit(): void {
    // Contador inicial
    this.notiService.refrescar();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects;
        const parts = url.split('/').filter(Boolean);
        const module = parts[0];
        const page = parts[1];
        this.currentModule = this.formatLabel(module);
        this.currentPage = this.formatLabel(page);

        // Refresca el contador en cada navegación (p.ej. al volver de notificaciones)
        this.notiService.refrescar();
      });
  }

  private formatLabel(text: string | undefined): string {
    if (!text) return 'Dashboard';
    return text.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    this.scrolled = window.scrollY > 8;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    this.toggleSidebar.emit();
  }

  requestToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  navigateTo(route: string): void {
    this.navigate.emit(route);
  }

  // Ir a notificaciones del módulo actual
  irANotificaciones(): void {
    // Obtener el módulo directamente de la ruta actual sin formato
    const currentUrl = this.router.url;
    const parts = currentUrl.split('/').filter(Boolean);
    const modulo = parts[0] || 'alumno'; // Default a 'alumno' si no hay módulo
    this.navigateTo('/' + modulo + '/notificaciones');
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu-wrap')) {
      this.userMenuOpen = false;
    }
  }
}